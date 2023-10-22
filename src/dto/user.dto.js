export default class UserDTO {
    constructor(user) {
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.age = user.age;
        this.githubProfile = user.githubProfile;
        this.role = user.role;
        this.cart = user.cart;
        this.last_connection = user.last_connection;
        this.documents = user.documents;
    }
}
