let body = document.querySelector("body")
let new_book = document.querySelector(".new_book")
let remove_book = document.querySelector(".remove_book")
let books = document.querySelector(".books")
let cm_in_px = document.querySelector(".library_heading").offsetHeight
let library_width = books.offsetWidth / cm_in_px

let library = []

if (!localStorage.getItem("library")) {
    localStorage.setItem("library",JSON.stringify(library))
}else{
    retrive_from_cache()
}


function Book(author, book, pages, read) {
    this.author = author
    this.book = book
    this.pages = pages
    this.read = read
}

function new_book_detail() {
    let book_detail_container = document.createElement("div")
    let book_detail = document.createElement("div")
    let book_detail_heading = document.createElement("h1")
    let author = document.createElement("input")
    let book = document.createElement("input")
    let pages = document.createElement("input")
    let read = document.createElement("input")
    let action = document.createElement("div")
    let add = document.createElement("button")
    let cancel = document.createElement("button")
    let err1 = document.createElement("div")
    let err2 = document.createElement("div")
    let err3 = document.createElement("div")
    let err4 = document.createElement("div")
    let err5 = document.createElement("div")
    
    book_detail_container.className = "book_detail_container"
    book_detail.className = "book_detail"
    book_detail_heading.className = "book_detail_heading"
    book_detail_heading.innerHTML = "Book Detail"
    author.className = "author book_detail_input"
    book.className = "book book_detail_input"
    pages.className = "pages book_detail_input"
    read.className = "read book_detail_input"
    action.className = "action"
    add.className = "add button"
    cancel.className = "cancel button"
    err1.className = "err"
    err2.className = "err"
    err3.className = "err"
    err4.className = "err"
    err4.className = "err"
    err5.className = "err"
    
    author.placeholder = "Author"
    book.placeholder = "Book"
    pages.placeholder = "Pages"
    read.placeholder ="Pages Read"
    add.innerHTML = "Add"
    cancel.innerHTML = "Cancel"
    
    action.append(add,cancel)
    book_detail.append(book_detail_heading,author,book,pages,read,action)
    book_detail_container.appendChild(book_detail)
    body.appendChild(book_detail_container)
    
    pages.addEventListener("keyup", ()=>{
        let val = parseInt(pages.value)
        pages.value = (isNaN(val)) ? "" : val
    })
    read.addEventListener("keyup", () => {
        let val = parseInt(read.value)
        read.value = (isNaN(val)) ? "" : val
    })
    
    add.addEventListener("click", ()=>{
        if (author.value == "") {
            err1.innerHTML = "Author name can't be blank"
            book_detail.insertBefore(err1, book)
        }else if (err1.innerHTML !== "") {
            err1.innerHTML = ""
            book_detail.removeChild(err1)
        }
        if (book.value == "") {
            err2.innerHTML = "Book name can't be blank"
            book_detail.insertBefore(err2, pages)
        } else if (err2.innerHTML !== "") {
            err2.innerHTML = ""
            book_detail.removeChild(err2)
        }
        if (pages.value == ("" || 0)) {
            err3.innerHTML = "Page number can't be empty"
            book_detail.insertBefore(err3, read)
        } else if (err3.innerHTML !== "") {
            err3.innerHTML = ""
            book_detail.removeChild(err3)
        }
        if (Number(pages.value) < Number(read.value)) {
            err4.innerHTML = "Pages you have read can't be greater than total pages"
            book_detail.insertBefore(err4, action)
        } else if (err4.innerHTML !== "") {
            err4.innerHTML = ""
            book_detail.removeChild(err4)
        }
        if (err1.innerHTML == "" && err2.innerHTML == "" && err3.innerHTML == "" && err4.innerHTML == "") {
            let book_exists = false
            library.forEach(obj => {
                if (obj.book.toLowerCase() === book.value.toLowerCase() && obj.author.toLowerCase() === author.value.toLowerCase()) {
                    book_exists = true
                }
            })
            if (!err5.innerHTML === "") {
                err5.innerHTML = ""
                book_detail.removeChild(err5)
                book_exists = false
            }
            if (book_exists) {
                err5.innerHTML = "Book already exists"
                book_detail.appendChild(err5)
            } else {
                (read.value == "")? (read.value = 0) : NaN
                library.push(new Book(author.value, book.value, pages.value, read.value))
                body.removeChild(book_detail_container)
                add_book(author.value, book.value, pages.value, read.value)
                update_catch()
            }
        }
    })
    cancel.addEventListener("click", () => {
        body.removeChild(book_detail_container)
    })
}

function library_structure() {
    let books_in_row = Math.floor(books.offsetWidth / (cm_in_px * 5))
    let grid_templete_columns = ""
    for (let i = 0; i < books_in_row; i++) {
        grid_templete_columns += `${100/books_in_row}% `
    }
    books.style.gridTemplateColumns = grid_templete_columns
}

function add_book(auth,book,page,read) {
    let single_book = document.createElement("div")
    let book_name = document.createElement("div")
    let author_name = document.createElement("div")
    let total_pages = document.createElement("div")
    let pages_read = document.createElement("div")
    let remove = document.createElement("button")

    single_book.className = "single_book"
    book_name.className = "book_display book_name"
    author_name.className = "book_display author_name"
    total_pages.className = "book_display total_pages"
    pages_read.className = "book_display pages_read"
    remove.className = "button remove"

    book_name.innerHTML = book
    author_name.innerHTML = auth
    total_pages.innerHTML = page
    pages_read.innerHTML = read
    remove.innerHTML = "Remove"

    single_book.append(book_name,author_name,total_pages,pages_read,remove)
    books.appendChild(single_book)

    remove.addEventListener("click",()=>{
        single_book.innerHTML = ""
        library.forEach((obj,index)=>{
            if(obj.book === book){
                library.splice(index,1)
                update_catch()
            }
        })
        books.removeChild(single_book)
    })
}


function synchronize_cache(){
    library_structure()
    retrive_from_cache()
    library.forEach(obj => {
        add_book(obj.author,obj.book,obj.page,obj.read)
    });
}

function update_catch() {
    localStorage.setItem("library", JSON.stringify(library))
}

function retrive_from_cache() {
    library = JSON.parse(localStorage.getItem("library"))
}
new_book.addEventListener("click", new_book_detail)