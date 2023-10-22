
export const register = (req, res) => {
    res.render("register");
};

export const login = (req, res) => {
    res.render("login");
};

export const profile = (req, res) => {
    //Lo envio asi porque enviando un solo objeto user y queriendo acceder a las propiedades me tira un error de handlebars y la manera que encontre de solucionarlo fue esta.
    const first_name = req.session.user.first_name;
    const last_name = req.session.user.last_name;
    const email = req.session.user.email;
    const age = req.session.user.age;
    const role = req.session.user.role;
    res.render("current", {
        first_name,
        last_name,
        email,
        age,
        role
    });
};

export const landing = (req, res) => {
    res.render("landing")
}