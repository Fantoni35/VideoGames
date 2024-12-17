using Microsoft.EntityFrameworkCore;
using GamesDataAccess;
using VideogamesWebApp.Services;

var builder = WebApplication.CreateBuilder(args);

// Aggiungi servizi per controller e viste
builder.Services.AddControllersWithViews();

// Configura il DbContext
builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("VideogamesDatabase")));

// Configura la cache distribuita e la sessione
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// Registra il StatisticsService qui
builder.Services.AddScoped<StatisticsService>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// Middleware
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseSession();
app.UseAuthorization();

// Inizializzazione del database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<DatabaseContext>();
    DbInitializer.Initialize(context);
}

// Configurazione del routing
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Login}/{id?}");

app.Run();
