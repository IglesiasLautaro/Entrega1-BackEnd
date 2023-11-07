const socket = io();
console.log("connected")

let id_item =document.getElementById('iD')

   let add_Button=document.getElementById('add_Button')
    add_Button.addEventListener('click',(e)=>{
        e.preventDefault();
      
let title_item = document.getElementById('title').value
let desc_item = document.getElementById('description').value
let code_item = document.getElementById('code').value
let price_item = document.getElementById('price').value
let stock_item = document.getElementById('stock').value
let cat_item = document.getElementById('category').value
let img_item = document.getElementById("IMG").value
    
let item_new={
        "title": title_item,
        "description":desc_item,
        "code":code_item,
        "price": price_item,
        "stock": stock_item,
        "category":cat_item,
        "thumbnail":img_item
    };
        if(title_item.length===0 || desc_item.length ===0 || code_item.length ===0 || 
        price_item.length===0 || stock_item.length===0 || cat_item.length===0){
            Swal.fire({
                html:"<b>Por favor completar toda la informacion</b>",
                toast:true,
                showConfirmButton: false,
                position:'top-right',
                timer:3000,
                timerProgressBar:true,
                color:"white",
                background:"red"
            })    
        }

        else{
            socket.emit('add_item',item_new)
        }

    })

    socket.on("confirmar",data=>{
        if(data[0]===false){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Parece que ya hay un item con el code ${data[1].code}`,
            });}
        else{
            //console.log("Last id is",data[2])
            const lastItemElement = document.getElementById(data[2]);
            const newElement = document.createElement('ul');
            let new_item =data[3]
            console.log(new_item)
            newElement.id=new_item.id
            newElement.innerHTML = `
            <h2>ID:${new_item.id} Nombre: ${new_item.title}</h2>
            <img src="${new_item.thumbnail}">
            <li>Description: ${new_item.description}</li>
            <li>Code: ${new_item.code}</li>
            <li>Price: ${new_item.price} Bells</li>
            <li>Categoria:${new_item.category}</li>
        `;
            lastItemElement.insertAdjacentElement('afterend', newElement)
        }
    });


    let delete_button = document.getElementById('delete_Button')
    delete_button.addEventListener('click',()=>{
    if(id_item.value.length<=0){
        Swal.fire({
            html:"<b>Algunos campos estan vacios</b>",
            toast:true,
            showConfirmButton: false,
            position:'top-right',
            timer:3000,
            timerProgressBar:true,
            color:"white",
            background:"red"
        })
    }
    else{
    let select = document.getElementById(String(id_item.value))
    console.log(select === null)
    if(select === null){
        Swal.fire({
            html:`<b>El item con el ID ${id_item.value} no se encuentra en la lista</b>`,
            toast:true,
            showConfirmButton: false,
            position:'top-right',
            timer:3000,
            timerProgressBar:true,
            color:"white",
            background:"red"
        })
    }else{
    Swal.fire({
        title: 'Estas seguro?',
        text: `Esto eliminara el item con el ID  ${id_item.value}  del archivo de forma permanente.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, borralo!'
    }).then((result) => {
        if (result.value) {
            socket.emit('borrar',id_item.value)
        } else {
        
        }
    });
    }}
    });
            
    socket.on('confirmar_borrado',data=>{
        if(data[0]){//select.remove
            let select=document.getElementById(String(data[1]))
            select.remove()
        }
    })