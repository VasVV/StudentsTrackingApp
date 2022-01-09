import { send } from 'emailjs-com';


export async function onSignUp(email, password, name) {
    try {
        await send('default_service', 'template_0etzukk', {
            email,
            password,
            name
        }, 'user_J5QXljpcHVnwCABX6mjP8')
    } catch (err) {
        console.log(err)
    }
}

export async function onAddTask(email, task, name) {
    try {
        await send('default_service', 'template_r91af55', {
            email,
            task,
            name
        }, 'user_J5QXljpcHVnwCABX6mjP8')
    } catch (err) {
        console.log(err)
    }
}

export async function onAddTaskAll(email, password, name) {
    try {
        await send('default_service', 'template_0etzukk', {
            email,
            password,
            name
        }, 'user_J5QXljpcHVnwCABX6mjP8')
    } catch (err) {
        console.log(err)
    }
}

export async function onCompleteTask(task, name) {
    try {
        await send('default_service', 'template_r91af55', {
         task,
            name
        }, 'user_J5QXljpcHVnwCABX6mjP8')
    } catch (err) {
        console.log(err)
    }
}

export async function onCompleteCheckTask(email, password, name) {
    try {
        await send('default_service', 'template_0etzukk', {
            email,
            password,
            name
        }, 'user_J5QXljpcHVnwCABX6mjP8')
    } catch (err) {
        console.log(err)
    }
}