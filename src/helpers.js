const status = st => {
    switch(st) {
        case 'toBeDone':
            return "Нужно сделать";
        case 'checking':
            return "Задание на проверке";
        case 'completed':
            return "Готово и проверено";
    }
}

export {status}