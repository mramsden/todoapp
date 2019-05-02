import { TodoItem } from './todo-item.js';

const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        display: block;
        font-family: sans-serif;
        text-align: center;
    }

    button {
        border: none;
        cursor: pointer;
    }

    ul {
        list-style: none;
        padding: 0;
    }
</style>

<h1>To do</h1>

<input type="text" placeholder="Add a new to do">
<button>✅</button>

<ul id="todos"></ul>
`;

class TodoApp extends HTMLElement {
    private _shadowRoot: ShadowRoot;
    private todoList: HTMLUListElement;
    private input: HTMLInputElement;
    private submitButton: HTMLButtonElement;
    private _todos = new Array<Todo>();

    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        
        this.todoList = this._shadowRoot.querySelector('ul') as HTMLUListElement;
        this.input = this._shadowRoot.querySelector('input') as HTMLInputElement;

        this.submitButton = this._shadowRoot.querySelector('button') as HTMLButtonElement;
        this.submitButton.addEventListener('click', this._addTodo.bind(this));
    }

    _addTodo() {
        if (this.input.value.length > 0) {
            this._todos.push({ text: this.input.value, checked: false });
            this._renderTodoList();
            this.input.value = '';
        }
    }

    _toggleTodo(e: OnToggleTodoEvent) {
        const todo = this._todos[e.detail];
        this._todos[e.detail] = Object.assign({}, todo, {
            checked: !todo.checked
        });
        this._renderTodoList();
    }
    
    _removeTodo(e: OnRemoveTodoEvent) {
        this._todos.splice(e.detail, 1);
        this._renderTodoList();
    }

    _renderTodoList() {
        this.todoList.innerHTML = '';

        this._todos.forEach((todo, index) => {
            let todoItem = document.createElement('todo-item') as TodoItem;
            todoItem.text = todo.text;
            todoItem.checked = todo.checked;
            todoItem.index = index;
            todoItem.addEventListener('onRemove', ((event: OnRemoveTodoEvent) => {
                this._removeTodo(event)
            }) as EventListener);
            todoItem.addEventListener('onToggle', ((event: OnToggleTodoEvent) => {
                this._toggleTodo(event);
            }) as EventListener);
            this.todoList.appendChild(todoItem);
        });
    }

    set todos(value: Array<Todo>) {
        this._todos = value;
        this._renderTodoList();
    }

    get todos() {
        return this._todos;
    }
}

window.customElements.define('todo-app', TodoApp);
