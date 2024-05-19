let bud_btn = document.querySelector(".bud-btn");
let exp_btn = document.querySelector(".exp-btn");
let edit_btn = document.querySelector(".edit");
let id = 0;

function make_it(check){
    if(check === true){
        if(localStorage.getItem("history") === null){
            // var store = JSON.parse(localStorage.getItem("history"));
            check_mid();
            return;
        }else{
            check_mid();
            check_history();
        }
    }else{
        remove_all();
        check_history();
    }
}

function remove_all(){
    let all_his = document.querySelector(".history");
    all_his.forEach(ele =>{
        ele.remove();
    })
}

function check_mid(){
    if(localStorage.getItem("heroMid") === null){
        return;
    }else{
        let obj = JSON.parse(localStorage.getItem("heroMid"))[0];
        document.querySelector(".total-money").innerText = obj.total_budget;
        document.querySelector(".total-exp").innerText = obj.total_expenses;
        document.querySelector(".remain").innerText = obj.total_balance;
    }
}

make_it(true);

function check_history(){
    if(localStorage.getItem("history") != null){
        let all_his = JSON.parse(localStorage.getItem("history"));
        let new_his = [];
        for(let i = 0; i < all_his.length; i++){
            if(all_his[i].removed === true){
                continue;
            }
            let exp_title = all_his[i].reason;
            let exp_money = all_his[i].money;
            obj ={
                reason:exp_title,
                money:exp_money
            }
            new_his.push(obj);
            add_exp_history(exp_title, Number(exp_money), false);
        }
        localStorage.removeItem("history");
        localStorage.setItem("history", JSON.stringify(new_his));
        alive_edit(id);
        alive_del(id);
    }
}


bud_btn.addEventListener("click", ()=>{
    console.log(typeof(document.querySelector(".bud-money").value));
    let val = document.querySelector(".bud-money").value;
    if(val.trim() === ""){
        return;
    }
    val = Number(val);
    if(val <= 0){
        return;
    }
    change_bud(val);
})




function change_bud(val){
    let total_money = document.querySelector(".total-money");
    total_money.innerText = val;
    calculate_balance(val);
}

function calculate_balance(val){
    let exp = document.querySelector(".total-exp");
    let remain = document.querySelector(".remain");
    exp = Number(exp.innerText);
    remain.innerText = val - exp;
    let obj = {
        total_budget: val,
        total_expenses: exp,
        total_balance: remain.innerText
    }
    let bm = [];
    bm.push(obj);
    localStorage.removeItem("heroMid");
    localStorage.setItem("heroMid",JSON.stringify(bm));
}

exp_btn.addEventListener("click", ()=>{
    let exp_title = document.querySelector(".exp-title").value;
    let exp_money = document.querySelector(".exp-money").value;
    if(check_falsy(exp_title, exp_money)){
        return;
    }
    add_exp_history(exp_title, Number(exp_money), true);
    alive_edit(id);
    alive_del(id);
    make_it(false);
})


function check_falsy(exp_title, exp_money) {
    if(exp_title.trim() === "" || exp_money === "" || Number(exp_money) <= 0){
        return true;
    }
    makeBud(exp_money);
    return false;
}

function add_exp_history(exp_title, exp_money, clicked){
    let expenses = document.querySelector(".expenses");
    let ele = '<div class="history" id="'+ id +'">' +
                    '<input type="text" value="'+exp_title+'" minlength="1" class="exp-reason" disabled >'+
                    '<input type="number" value="'+ exp_money +'" min="0" class="exp-his-money" disabled >'+
                    '<button class="edit">' +'<i class="fa-solid fa-pen-to-square">' +'</i>' +'</button>'+
                    '<button class="del">' +'<i class="fa-solid fa-trash">'+'</i>'+'</button>'+
                '</div>';
    // stringToHTML(ele);
    id += 1;
    expenses.innerHTML += ele;
    if(clicked === true){
        if(localStorage.getItem("history") != null){
            var store = JSON.parse(localStorage.getItem("history"));
        }else{
            var store = [];
        }
        console.log(exp_title);
        console.log(exp_money);
        let obj = {
            reason:exp_title,
            money:exp_money
        }
        store.push(obj);
        localStorage.removeItem("history");
        localStorage.setItem("history", JSON.stringify(store));
    }
    // make_edit();
}

function alive_edit(id){
    for(let i = 0; i < id; i++){
        let selectt = document.getElementById(i);
        console.log(selectt);
        let pressed = 1;
        let edit_btn = selectt.querySelector(".edit");
        edit_btn.addEventListener("click", ()=>{
            let selectt = document.getElementById(i);
            let edit_tit = selectt.querySelector(".exp-reason");
            let edit_mon = selectt.querySelector(".exp-his-money");
            console.log(edit_tit);
            console.log(edit_mon);
            if(pressed === 2){
                if(Number(edit_mon.value) < 0 || edit_tit.value.trim() === ""){
                    return;
                }
                edit_tit.disabled = true;
                edit_mon.disabled = true;
                console.log(edit_tit.value);
                set_Edit(i, edit_tit.value, Number(edit_mon.value));
                pressed = 1;
                console.log("2");
            }else if(pressed === 1){
                console.log("1");
                edit_tit.disabled = false;
                edit_mon.disabled = false;
                edit_mon.focus();
                edit_tit.focus();
                pressed = 2;
            }
        })
    }
}

let ele_deleted = 0;

function alive_del(id){
    for(let i = 0; i < id; i++){
        let selectt = document.getElementById(i);
        console.log(selectt);
        let del_btn = selectt.querySelector(".del");
        del_btn.addEventListener("click", ()=>{
            let All = JSON.parse(localStorage.getItem("history"));
            All[i].removed = true;
            makeBud(Number(-All[i].money));
            localStorage.removeItem("history")
            localStorage.setItem("history", JSON.stringify(All))
            ele_deleted += 1;
            selectt.remove();
        })
    }
}


function set_Edit(place , reasons, money_n){
    let All = JSON.parse(localStorage.getItem("history"));
    let ele_before = 0;
    for(let i = 0; i < place; i++){
        if(All[i].removed === true){
            ele_before += 1;
        }
    }
    place += ele_before;
    let prev_mon = All[place].money;
    All[place].reason = reasons;
    All[place].money = money_n;
    localStorage.removeItem("history");
    localStorage.setItem("history", JSON.stringify(All));
    let ans = Number(money_n) - Number(prev_mon)
    makeBud(ans);
}


function makeBud(exp_money){
    let total_exp = document.querySelector(".total-exp");
    let total_balance = document.querySelector(".remain");
    total_exp.innerText = Number(total_exp.innerText) + Number(exp_money);
    total_balance.innerText = Number(total_balance.innerText) - Number(exp_money);
    let val = Number(document.querySelector(".total-money").innerText);
    calculate_balance(val);
}