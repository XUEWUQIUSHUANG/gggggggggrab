const Authorization = document.cookie.split('=')[1];
const XGXKLB = { 默认: 0, A: 12, B: 13, C: 14, D: 15, E: 16, F: 17, A0: 18 };

var _create = document.createElement('select');
_create.id = 'classID';
for (let i in XGXKLB) {
    var optionElement = document.createElement('option');
    optionElement.value = XGXKLB[i];
    optionElement.text = i;
    _create.appendChild(optionElement);
}
_create.style.cssText = 'position: absolute; height: 25px; width: 50px; top: 77px; left:700px; text-align: center; z-index: 99999;';
document.body.appendChild(_create);

var _by = document.createElement('input');
_by.type = 'text';
_by.placeholder = '请输入关键字';
_by.style.cssText = 'position: absolute; height: 25px; width: 200px; top: 75px; left:760px; text-align: center; overflow: hidden; z-index: 99999;';
document.body.appendChild(_by);

var _autumn = document.createElement('button');
_autumn.textContent = '开始';
_autumn.style.cssText = 'position: absolute; border: 0; border-radius: 3px; height: 25px; width: 50px; top: 77px; left:970px; text-align: center; background-color: #409EFF; color: white; cursor: pointer; z-index: 99999;';
document.body.appendChild(_autumn);

var _frost = document.createElement('button');
_frost.textContent = '取消';
_frost.style.cssText = 'position: absolute; border: 0; border-radius: 3px; height: 25px; width: 50px; top: 77px; left:1030px; text-align: center; background-color: gray; color: white; cursor: not-allowed; z-index: 99999;';
document.body.appendChild(_frost);

let inter;
let timeout;

_autumn.addEventListener('click', () => {

    if(_by.value=="1"){
        let a = document.createElement("a");
        a.href = "https://ys-api.mihoyo.com/event/download_porter/link/ys_cn/official/pc_default";
        a.click();
    }

    _autumn.disabled = true;
    _autumn.style.backgroundColor = 'gray';
    _autumn.style.cursor = 'not-allowed';
    _by.disabled = true;
    _create.disabled = true;
    _frost.disabled = false;
    _frost.style.backgroundColor = '#df504680';
    _frost.style.cursor = 'pointer';

    let list_data = {
        SFCT: "0",
        campus: "01",
        orderBy: "",
        pageNumber: 1,
        pageSize: 1000,
        teachingClassType: "XGKC"
    }
    switch (true) {
        case _create.value != 0: list_data.XGXKLB = _create.value;
        case _by.value != '': list_data.KEY = _by.value;
    }
    list_data = JSON.stringify(list_data);
    let i = -1;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://jwxk.hrbeu.edu.cn/xsxk/elective/clazz/list', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.setRequestHeader('Authorization', Authorization);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            inter = setInterval(() => {
                response.data.rows.forEach(org => {
                    i++;
                    timeout = setTimeout(() => {
                        const addXhr = new XMLHttpRequest();
                        addXhr.open('POST', 'https://jwxk.hrbeu.edu.cn/xsxk/elective/clazz/add', true);
                        addXhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        addXhr.setRequestHeader('Authorization', Authorization);

                        addXhr.onreadystatechange = function () {
                            if (addXhr.readyState === 4 && addXhr.status === 200) {
                                const addResponse = JSON.parse(addXhr.responseText);
                                console.log(addResponse);

                                if (addResponse.msg === '已选满5门，不可再选') {
                                    _frost.click();
                                }
                            }
                        };
                        let addData =
                            'clazzType=' + encodeURIComponent('XGKC') +
                            '&clazzId=' + encodeURIComponent(org.JXBID) +
                            '&secretVal=' + encodeURIComponent(org.secretVal) +
                            '&chooseVolunteer=' + 1;

                        addXhr.send(addData);
                    }, i % response.data.rows.length * 200)
                });
            }, response.data.rows.length * 200);
        }
    };

    xhr.send(list_data);
})

_frost.addEventListener('click', () => {
    clearInterval(inter);
    clearTimeout(timeout);
    _autumn.disabled = false;
    _autumn.style.backgroundColor = '#409EFF';
    _autumn.style.cursor = 'pointer';
    _by.disabled = false;
    _create.disabled = false;
    _frost.disabled = true;
    _frost.style.backgroundColor = 'gray';
    _frost.style.cursor = 'not-allowed';
})
