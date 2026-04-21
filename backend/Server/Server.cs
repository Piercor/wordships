using Server;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.GameEndpoints();
app.PlayerEndpoints();

app.MapGet("/api/health", () => Results.Ok("OK"));

app.Run();
