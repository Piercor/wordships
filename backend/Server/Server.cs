var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/api/hello", () => new { message = "Hello from .NET!" });

app.Run();
