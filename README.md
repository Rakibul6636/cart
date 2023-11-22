The Machine needs to have, Git, Composer, PHP, Node. Steps to run the project.
 Clone the RepOpen a terminal or command prompt on the PC and navigate to the directory where you want to clone this project. Run the following command: git clone https://github.com/Rakibul6636/cart.git
For Backend Setup:
1.  Install Dependencies: Navigate into the project directory using the terminal: cd cart/backend
2. Install the project dependencies using Composer: composer install
3. Run the migration to create database php artisan migrate
4. Run the seeder for demo product and user ```php artisan db:seed``` and for admin seeder: php artisan db:seed --class=UserSeeder
5. Serve the Application: Use the following command to start the development server: php artisan serve
For Frontend Setup:
1.  Install Dependencies: Navigate into the project directory using the terminal: cd cart/frontend
2. Install the project dependencies using npm: npm install
3. Serve the Application: Use the following command to start the development server: npm start


You can see the sample of the project: https://youtu.be/KUYB1A1-pnE
You can test all the routes using Postman. The postman documentation can be found in the link: https://documenter.getpostman.com/view/28175443/2s9YeABuq7

