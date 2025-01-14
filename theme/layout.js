import {Platform} from "react-native";

const layout = {
    borderRadius: {
        'xl': 12,
        '2xl': 16,
        full: 9999
    },
    shadow: {
        ios: {
            sm: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
            },
            xl: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
            }
        },
        android: {
            sm: {
                elevation: 2,
            },
            xl: {
                elevation: 8,
            }
        }
    }
};

export default layout;