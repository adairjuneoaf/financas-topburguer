const lineInputEmail = document.querySelectorAll('.form .dados .dados-email')
const lineInputPassword = document.querySelectorAll('.form .dados .dados-senha')

const lineEmail = document.querySelector('.form .line-email')
const iconEmail = document.querySelector('.form .dados .icon-user')

const linePassword = document.querySelector('.form .line-password')
const iconPassword = document.querySelector('.form .dados .icon-cadeado')

lineInputEmail.forEach(lineFocusEmail => {
    lineFocusEmail.addEventListener('focus', () =>{
    lineEmail.classList.add('line-strong')
    iconEmail.classList.add('icons-strong')
    })

    lineFocusEmail.addEventListener('blur', () =>{
    lineEmail.classList.remove('line-strong')
    iconEmail.classList.remove('icons-strong')
    })
})

lineInputPassword.forEach(lineFocusPassword => {
    lineFocusPassword.addEventListener('focus', () =>{
    linePassword.classList.add('line-strong')
    iconPassword.classList.add('icons-strong')
    })

    lineFocusPassword.addEventListener('blur', () =>{
    linePassword.classList.remove('line-strong')
    iconPassword.classList.remove('icons-strong')
    })
})

