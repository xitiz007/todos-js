let Todo = function(title, id, completed= false)
{
    this.title = title;
    this.completed = completed;
    this.id = id;
}

function getTodosArray()
{
    const arrayString = localStorage.getItem('todos');
    if (arrayString)
    {
        return JSON.parse(arrayString);
    }
    return new Array();
}

function getArrayIndexNext()
{
    return getTodosArray().length;
}

function setLocalStorageFromArray(todoArray)
{
    const todoArrayToString = JSON.stringify(todoArray);
    localStorage.setItem('todos', todoArrayToString);
}

function removeAllTodos()
{
    const main_tag = document.querySelector('.todo-list');
    main_tag.innerHTML = '';
}

function reAssignIdToInstance(todoArray)
{
    for (let index = 0; index < todoArray.length ; index++)
    {
        todoArray[index].id = index;
    }
    return todoArray;
}

function removeTodoInstance(todoInstance)
{
    const indexOfInstance = todoInstance.id;
    let todoArray = getTodosArray();
    todoArray.splice(indexOfInstance, 1);
    todoArray = reAssignIdToInstance(todoArray);
    setLocalStorageFromArray(todoArray);
    removeAllTodos();
    renderTodosFromLocalStorage();
}

function saveInstanceToLocalStorage(todoInstance)
{
    const arrayList = getTodosArray();
    arrayList.push(todoInstance);
    const arrayToString = JSON.stringify(arrayList);
    localStorage.setItem('todos', arrayToString);
}

function renderTodosFromLocalStorage()
{
    const todosArray = getTodosArray();
    if (todosArray)
    {
        todosArray.forEach(todoInstance => {
            showTodoItem(todoInstance);
        });
    }
}

function start()
{
    let form = document.querySelector('#form');
    let selection = document.querySelector('#filter-todo');

    form.addEventListener('submit', formSubmitted);
    selection.addEventListener('change', selectionChanged);

    renderTodosFromLocalStorage();
}

function showFromTodoArray(todoArray)
{
    todoArray.forEach(instance => {
        showTodoItem(instance);
    })
}

function selectionChanged(event)
{
    removeAllTodos();
    const value = this.value;
    let todoArray = [];
    if(value === 'all')
    {
        todoArray = getTodosArray();
    }
    else if (value === 'completed')
    {
        getTodosArray().forEach(instance => {
            if(instance.completed)
            {
                todoArray.push(instance);
            }
        });
    }
    else if(value === 'uncompleted')
    {
        getTodosArray().forEach(instance => {
            if(!instance.completed)
            {
                todoArray.push(instance);
            }
        });
    }
    showFromTodoArray(todoArray);
}

function formSubmitted(event)
{
    const form_data = new FormData(form);
    const title = form_data.get('todos_title').trim();
    event.preventDefault();
    document.querySelector('#todo-input').value = '';
    appendTodoItem(title);
}

function getTodoInstance(title)
{

    return new Todo(title, getArrayIndexNext());
}

function appendTodoItem(title)
{
    const todoInstance = getTodoInstance(title);
    saveInstanceToLocalStorage(todoInstance);
    showTodoItem(todoInstance);
}

function canDisplayTodo(todoInstance)
{
    const value = document.querySelector('#filter-todo').value;
    if(value == 'all' || value == 'completed' && todoInstance.completed || value == 'uncompleted' && !todoInstance.completed)
    {
        return true;
    }
    return false;
}

function showTodoItem(todoInstance)
{
    if (canDisplayTodo(todoInstance))
    {
        const title = todoInstance.title;
        const isCompleted = todoInstance.completed;

        const todo_tag = document.createElement('div');
        todo_tag.classList.add('todo');
        todo_tag.todoInstance = todoInstance;

        const li_item = document.createElement('li');
        li_item.classList.add('todo-item');
        li_item.innerText = title;

        const button_complete_tag = document.createElement('button');
        button_complete_tag.classList.add('complete-btn');
        button_complete_tag.innerHTML = `<i class="fas fa-check"></i>`;
        button_complete_tag.style= "outline: none;";
        button_complete_tag.addEventListener('click', completeButtonClicked);

        const button_remove_tag = document.createElement('button');
        button_remove_tag.classList.add('trash-btn');
        button_remove_tag.innerHTML = `<i class="fas fa-trash"></i>`;
        button_remove_tag.style = "outline: none;"
        button_remove_tag.addEventListener('click', removeButtonClicked);

        todo_tag.appendChild(li_item);
        todo_tag.appendChild(button_complete_tag);
        todo_tag.appendChild(button_remove_tag);

        const todo_list = document.querySelector('.todo-list');
        todo_list.appendChild(todo_tag);

        doStrikeOrUnStrike(isCompleted, todo_tag);
    }
    
}

function toggleCompleteTodos(todoInstance)
{
    const indexOfInstance = todoInstance.id;
    const todoArray = getTodosArray();
    todoArray[indexOfInstance].completed = !todoArray[indexOfInstance].completed;
    setLocalStorageFromArray(todoArray);
}

function doStrikeOrUnStrike(tof, todo_tag)
{
    const todo_item_tag = todo_tag.querySelector('.todo-item');
    const title = todo_item_tag.innerText;
    if (tof)
    {
        const del_tag = document.createElement('del');
        del_tag.innerText = title;
        todo_item_tag.innerHTML = '';
        todo_item_tag.appendChild(del_tag);
    }
    else 
    {
        todo_item_tag.innerHTML = '';
        todo_item_tag.innerText = title;
    }
}

function completeButtonClicked(event)
{
    const todo_tag = this.parentNode;
    const todoInstance = todo_tag.todoInstance;
    toggleCompleteTodos(todoInstance);
    removeAllTodos();
    showFromTodoArray(getTodosArray());
}

function removeButtonClicked(event)
{
    const todo_tag = this.parentNode;
    const todoInstance = todo_tag.todoInstance;
    removeTodoInstance(todoInstance);
    todo_tag.remove();
}

start();