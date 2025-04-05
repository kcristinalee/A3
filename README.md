# CMSC471: A3
Group Members: Isabel Flynn, Christina Lee, Kamyavalli Mopidevi

Link to Public Webpage: https://kcristinalee.github.io/A3/

Link to Writeup: https://A3/writeup

Link to Demo: https://A3Demo

## White Hat
In tackling this dataset, we faced a challenge: how to meaningfully display a large number of attributes. To overcome this, my team and I decided to first group all attributes with gender-specific data (Female and Male). Within this subset, we then categorized education-related attributes to the x-axis and health-related attributes to the y-axis. For health-related attributes that did not include gender-specific data, we used other visualization properties such as size and color of the data points. To clean up the dataset, we eliminated any attributes that were not being used.

Our final visualization, titled “Exploring the Link Between Worldwise Education and Health,” was designed to allow users to explore the intersection of education and health metrics. The x-axis dropdown lets the user choose between various education-related indicators, such as “Primary Enrollment,” “Children Out of School,” “Bachelor’s or Higher,” “Secondary Enrollment,” and “Tertiary Enrollment.” Each of these indicators has both Female and Male options for comparison. The y-axis dropdown, on the other hand, offers choices related to health, specifically “Life Expectancy,” with separate options for both Female and Male data. 

In addition to the education and health indicators, we integrated other visual properties. The color of the data points is linked to the “Fertility Rate,” and the size of the data points reflects the “Births Attended by Skilled Staff.” This allows the visualization to capture multiple dimensions of health alongside education data.

To help users interpret the color scale, we created a legend. The scale starts with yellow at the lowest value (0) and transitions to dark blue at the highest value (7), providing an intuitive gradient for understanding fertility rate values.

This data visualization qualifies as a white hat because it is designed to be clear and easily interpretable for the general audience. The grouping of education and health attributes along with intuitive color and size mappings ensures that users can quickly understand the relationships between key variables. Additionally, any data transformations, such as grouping gender-specific attributes and eliminating unused data, are transparently communicated through the design choices. The sources of the data and any potential biases are clearly addressed under the data visualization, ensuring that viewers are aware of the context and limitations behind the presented information.

## Black Hat
For the black hat visualization, we initially struggled to decide on a misleading narrative we wanted to push because the dataset had so many indicators per country. We first tried to find a controversial message that was actually supported from the data, but that approach didn’t produce anything that would work for a black hat visualization. Eventually, we realized that we didn’t need to work with the data, we could just rework the data itself by filtering it to create a false trend. We chose to push the claim that lower levels of female education are associated with longer life expectancy for women, even though this isn’t supported by the full dataset.
To do this, we filtered out all countries that had both high female education and high female life expectancy, since they contradicted the message we wanted to push. However, once we looked at the resulting graph, the data was too clearly manipulated, since the absence of any conflicting data points made the graph look very suspicious. So, we revised our filter to allow five countries with high education and high life expectancy back in, just to make the data look more balanced and believable. This helped us maintain the illusion of legitimacy while still pushing our deceptive message.
We reinforced this narrative through our axis choices. The y-axis was locked to “Life Expectancy (Female)” and the x-axis was restricted to only female education-related variables, removing the user’s ability to explore other relationships. This further narrowed the scope of the visualization to only show data that supported our false trend, and helped push the illusion that there is a strong inverse correlation between female education and life expectancy.


To further emphasize our misleading narrative, we chose to represent the data points that supported our claim as large, dark red bubbles, making them visually dominant. In contrast, countries that contradicted our message were shown as much smaller bubbles in a lighter red color, causing them to fade into the background. While our legend technically discloses this information and defines what each bubble represents, the stark difference in size and color draws the viewer’s attention disproportionately to the supporting data. As a result, even with the disclosure, the visual feels more jarring and persuasive, which subtly reinforces our false narrative.

Another visually misleading element was the randomized sizing of the large, dark red bubbles. These bubbles represent the countries that support our false narrative, and although their sizes vary, the differences aren’t tied to any actual data, they are totally random.  The varying sizes make the bubbles appear more legitimate, as if they’re encoding some additional meaningful variable, when they’re not. The visual interest created by their varying sizes also draws the viewer’s attention to them first, subtly reinforcing our deceptive claim and making it seem more prominent within the dataset.

The title of the graph, “An Unexpected Link: Lower Female Education, Longer Lives,” further reinforces our misleading narrative. Instead of using an unbiased or neutral title that would allow viewers to draw their own conclusions, we immediately make our misleading claim that lower female education is linked to longer life expectancy. This primes the viewer to interpret the graph with that assumption in mind, making them more likely to see a pattern that supports the narrative, even if the overall data tells a more complex story.

## AI Usage
We used ChatGPT on the rigorous tasks of our project: creating the options list that mapped a user-friendly label to the value in the given dataset, along with filtering out dropdown attributes we did not want to use. We felt comfortable with asking ChatGPT for help on this portion of the project because the main takeaway of this project was to learn how to build a data visualization and implement the techniques we learned in class, not manually filtering and cleaning up the data.

## References
The World Bank. Gender Equality Indicators 1960–2017. The World Bank, 
https://github.com/light-and-salt/World-Bank-Data-by-Indicators/tree/master/gender

