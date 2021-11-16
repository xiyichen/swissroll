export function getCurrentDate(separator='-'){

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    
    // return `${month<10?`0${month}`:`${month}`}${separator}${date}${separator}${year}`
    return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
}

export function getFirstDayOfTheMonthAfterNext(separator='-'){

    let newDate = new Date()
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    let date = 1;

    if (month <= 10) {
        month += 2;
    } else if (month === 11) {
        month = 1;
        year += 1;
    } else {
        month = 2;
        year += 1;
    }
    
    return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
}

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

export function toMmDdYyyy(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate() 
    let year = date.getFullYear()
    month = zeroPad(month, 2);
    day = zeroPad(day, 2);
    year = zeroPad(year, 4);
    // return month + '/' + day + '/' + year
    return year + '-' + month + '-' + day
}

export function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function ifConfirmationLink(link) {
    if (!link.includes('confirm')) {
        return false;
    }
    const re = /^\/[0-9A-Za-z_\-]+\/[0-9A-Za-z]{1,15}-[0-9A-Za-z]{1,35}\/?$/;
    return re.test(link.split('confirm')[1]);
}

export function ifUnsubscriptionLink(link) {
    if (!link.includes('unsubscribe/email')) {
        return false;
    }
    const re = /^\/[0-9A-Za-z_\-]+\/[0-9A-Za-z]{1,15}-[0-9A-Za-z]{1,35}\/?$/;
    return re.test(link.split('email')[1]);
}

export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export function timeout(milliseconds, promise) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("timeout exceeded"))
      }, milliseconds)
      promise.then(resolve, reject)
    })
}