export const validateEmail = function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export const errorMessages = {
    name: {
        empty: 'No haz ingresado un nombre.',
        spaces: 'Tu nombre contiene espacios.',
    },
    surname: {
        empty: 'No haz ingresado un apellido.',
        spaces: 'Tu apellido contiene espacios.',
    },
    email: 'El e-mail no es válido.',
    password: 'La contraseña es menor a 8 carácteres.',
    confirmpassword: {
        nomatch: 'Las contraseñas no coinciden.',
        empty: 'No haz ingresado la confirmación de tu contraseña.',
    },
    duplicateAccount: 'Esta cuenta ya fue creada',
    internalServerError: 'Hubo un problema del servidor',
    certificateError: 'Hubo problema con tu WIFI, prueba con otra conexión.',
    noConnection: 'No tienes conexión de Internet. ',
    wrongPassword: 'La contraseña ingresada es incorrecta.',
}