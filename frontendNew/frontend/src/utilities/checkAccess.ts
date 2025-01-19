const checkAccess = async (menuOption: string): Promise<boolean> => {
    console.log("in checkAccess Checking access for menuOption: " + menuOption)
 
   return new Promise((resolve) => {
       // Retrieve existing permissions from localStorage
       const permission = localStorage.getItem('existingPermissions');
 
       console.log("Existing permissions: " + permission);
 
         if (permission) {
             const newArr = permission.split(',');
             console.log("New array: " + newArr);
         
             if (newArr) {
                 const access = JSON.parse(permission);
 
                 console.log("Access: " + access);
 
                 // Check if menuOption exists in access permissions
                 if (access.includes(menuOption)) {
                     //resolve(true); // Access granted
                     return true;
                 } else {
                    return false
                 }
             }
             return
         }
 
         if (!permission) {
             // Access denied
             alert("You don't have permission to access. Access denied.");
             resolve(false);
         }
     });
 };
 
 export default checkAccess;
