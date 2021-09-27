const exp = document.querySelector('#expression')
const not = document.querySelector('#notation')
const button = document.querySelector('#get5')
const results = document.querySelector('.results')
const up = document.querySelector('#up')

let base = 0

up.onclick = () => {
    window.scrollTop -= '10px'
}
function toNotation(num) {
    let string = ''
    let i = num
    let BIbase = BigInt(base)
    while(i >= BIbase) {
        string += i%BIbase
        i = (i-(i%BIbase))/BIbase
    }
    string += i.toString()
    return string.split('').reverse().join('')
}

function showResults(value, num) {
    let sum = 0
    for(let i = 0; i < value.length; i++) {
        sum += +value[i]
    }
    let linum = document.createElement('li')
    let livalue = document.createElement('li')
    linum.textContent = `Число в исходной системе счисления(10):\n ${num}`
    linum.classList.add('linum')
    livalue.textContent = `Число в системе счисления ${base}:\n ${value}`
    livalue.classList.add('livalue')
    results.append(linum)
    results.append(livalue)
    let li = document.createElement('li')
    li.classList.add('sum')
    li.textContent = `Сумма всех чисел равна: ${sum}`
    results.append(li)
    let max = [0, 0]
    let min = [0, 0]
    for(let i = 0; i < base; i++) { 
        let count = value.split(i).length-1
        if(i === 0) {
            max[0] = count
            max[1] = i
            min[0] = count
            min[1] = i
            continue
        }
        if(count > max[0]) {
            max[0] = count
            max[1] = i
        }
        if(count < min[0]) {
            min[0] = count
            min[1] = i
        }
    }
    let limax = document.createElement('li')
    let limin = document.createElement('li')
    limax.classList.add('max')
    limin.classList.add('min')
    limax.textContent = `Чаще всего встречается число ${max[1]}:  ${max[0]} раз(-a)`
    limin.textContent = `Реже всего встречается число ${min[1]}:  ${min[0]} раз(-a)`
    results.append(limax)
    results.append(limin)
    for(let i = 0; i < base; i++) {
        let li = document.createElement('li')
        li.textContent = `Всего цифр ${i} в числе: ${value.split(i).length-1}`
        results.append(li)
    }
}
button.onclick = async (e) => {
    results.innerHTML = ''
    base = +not.value
    if(base > 5000 || base < 2 || exp.value.length > 400) {
        exp.value = ''
        not.value = ''
        return
    }
    let res = await fetch('/evl', {
        method: 'POST',
        body: JSON.stringify({exp: exp.value}),
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => response.json())
        .then(data => data)
    let num = BigInt(res['result'])
    exp.value = res['exp']
    if(num <= base) {
        exp.value = ''
        not.value = ''
        return
    }
    let value = toNotation(num)
    showResults(value, num)
}

exp.oninput = (e) => {
    if(e.inputType === 'insertText') {
        const symbols = '1234567890*-+/()'
        if(!symbols.includes(e.data)) {
            exp.value = exp.value.slice(0, exp.value.length-1)
        }
    }
}
