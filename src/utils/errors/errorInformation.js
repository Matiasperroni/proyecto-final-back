export const userError = (user) => {
    return `One or more properties were incomplete or not valid.
    -first_name : needs to be a String, received ${user.first_name}
    -last_name : needs to be a String, received ${user.last_name}
    -email : needs to be a String, received ${user.email}
    -age: needs to be a String, received ${user.age}
    -password: ${user.password}`;
};

//products errors

export const productError = (id) => {
    return `
    -Could not get all products
    -The product with the requested id ${id} does not exist`;
};

export const addProductError = () => {
    return `Could not add/update the product. Posible problems:
    -Missing to fill some fields or are incorrect`;
};

//cart errors

export const createCartError = (cartID, prodID) => {
    return `
    - Cart with id: ${cartID} doesn´t exists
    - Product with id: ${prodID} doesn´t exists`;
};

// messages errors

export const createMessageError = () => {
    return `
    -Could not get messages`;
};

export const addMessageError = () => {
    return `
    -Username doesn´t exists
    -The user and message fields do not exist or are incorrect`;
};

// SERVER ERROR

export const createServerError = (error) => {
    return `An internal error occurred on the server.
      More information about the error:
      ${error}`;
};
