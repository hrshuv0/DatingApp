# DatingApp
This is a dating app built with Angular and .NET Core 6.0. It is based on the Udemy course "Build an app with ASPNET Core and Angular from scratch" by Neil Cummings.

## Development server
Run `dotnet watch run` for a dev server. Navigate to `http://localhost:5000/`. The app will automatically reload if you change any of the source files.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Database
The database is a SQLite database. It is located in the DatingApp.API folder and is called DatingApp.db. To open the database, download the SQLite extension for VS Code and open the database in the explorer.

## Running migrations
To run migrations, run `dotnet ef database update` in the DatingApp.API folder.

## Running tests
To run tests, run `dotnet test` in the DatingApp.API folder.

## Running the app
To run the app, run `dotnet run` in the DatingApp.API folder and `ng serve` in the DatingApp-SPA folder.

## Technologies used
- Angular
- .NET Core 6.0
- SQLite
- AutoMapper
- Entity Framework Core
- Cloudinary



