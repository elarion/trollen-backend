const { body } = require("express-validator");
const { characterValidationRules } = require('./characterValidator');
const User = require("../models/users");
/**
 * Validation rules for user creation
 */
const updateUsernameValidationRules = () => {
    const validationRules = 
        body("username", "The username is required")
            .custom(async (value) => {
                const user = await User.exists({ username: value });
                if (user) {
                    throw new Error("This username is already used");
                }

                return true;
            })
            if (isCharacter) {
                validationRules.push(...characterValidationRules());
            }
        
            return validationRules;
        }

        module.exports = {
            updateUsernameValidationRules,
        };
        
        const updateUsername = async (userId, newUsername) => {
            try {
              const response = await axios.put(
                `https://votre-api.com/users/${userId}`, // Remplacez par votre URL API
                {
                  username: newUsername,
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Si nécessaire
                  },
                }
              );
          
              console.log('Username updated successfully:', response.data);
              return response.data;
            } catch (error) {
              console.error('Error updating username:', error);
              throw error;
            }
          };