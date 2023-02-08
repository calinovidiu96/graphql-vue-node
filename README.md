# graphql-vue-node
This project use NodeJs, Nuxt3, GraphQL, Apollo, PostgreSQL, Prisma. 

Be sure that you have installed:
- NodeJs (https://nodejs.org/en/download/). I used version 16 for this project.
- PostgreSQL (https://www.postgresql.org/download/)

Steps to repro:

🗄 1. To use this app first you will need to run a PostgreSQL database. I attached also a folder named 'database' that contains a docker-compose.yml with images for postgres:13 and pg-admin but running on Docker with low memory you may have problems with seeding.

🗂 2. Now use pgAdmin to create a new database. Keep in mind the credentials, you will need them to set up the connection link. Don't mind the database structure now, you will have a command to migrate it from Prisma.

🔧 3. It's time to build the app. Using your terminal open the folder named 'app'. I split the app in two parts, 'client' and 'server'.
   4. Open the 'server' folder with your favorite code editor and you will find a '.env.model' file. Duplicate it and delete '.model'. 
     Edit DATABASE_URL="postgresql://ACCOUNT:PASSWORD@localhost:PORT/DB_NAME" . You have to replace ACCOUNT, PASSWORD, PORT, DB_NAME. You have this datas from the first step.
     
⚙️  5. Let's start with the server:
   6. Now you have to run this commands into your terminal. Make sure that you are in the 'server' folder:
   7. npm install (This will install all the dependencies.)
   8. npm run build (This will build the app so you can run it in the next steps.)
   9. npm run migrate (This will build database tables and the relations between them. For this step I used Prisma.)
   10. npm run seed (This will populate the database from predefined .csv files that you can find in '/server/data' folder.)
🚀 11. npm start (This will start the backend server. This will run on http://localhost:8000/ )

💻 12. Let's build the client:
   13. Using your terminal go to '/app/client' folder
   14. npm install
   15. npm run build (Make sure that if you will change the server port from :8000 that I used by default for server, change it also into client. You find the link in 'nuxt.config.ts' file. This is the port where your Client will send request to Server.
🚀 16. npm start (This will start the client app. That will run on http://localhost:3000/ )

 
  THE END
 

    


