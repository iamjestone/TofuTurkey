# D3Project
To Initiate the Project:
1. Open final_project_folder
2. Open html_rm folder
3. Open index.html file in Visual Studio Code
4. Run python -m http.server in Terminal
5. Open local host in browser

PROJECT SUMMARY:
- From Tofu to Turkey: Healthy for you? Healthy for the Earth?
  - An exploration of the nutrient value of food and the resources used to produce it

PROJECT CONCEPT
- Initial Idea
  - Growth of Vegetarian/Veganism and the “presumed” corresponding growth in sales of “meatless” products
  - Lack of accurate data on number of vegetarians/vegans
  - Difficulty finding robust sales data

- Evolution
  - Discovered USDA & Oxford University data for nutritional value of products and resource usage when producing key ingredients

- Final Project
  - Measuring the nutritional value, emissions, land and water usage of vegan and non-vegan products

- DATA: ETL/CRUD
  - Used USDA Food Composition Databases & University of Oxford Environmental Data
  - Narrowed database with emissions, land, and water usage down to key categories
  - Created list of meat-based foods (hamburger, turkey burger, etc.) and their corresponding meatless substitutes (bean burger, mushroom burger, etc.)
  - Used list to create a query that provide nutrient values for selected foods

- GRAPHS
  - Nutritional Value of a Non-Vegan Item and its Vegan Substitute
    - Energy (Kcal), Fat (g), Carbs (g), Fiber (g), Protein (g), & Sugar (g)
  - Emissions & Land and Water Usage in the Production of Food Items
    - Nutrient Units, Land Use, CO2 Emissions, SO2 Emissions (sulfur dioxide), PO4 Emissions (phosphate), Freshwater Withdrawals

- CHALLENGES
  - Accessing the API
  - Flask/Heroku
  - Working non-linearly
