const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        display: block;
        font-family: sans-serif;
    }

    .completed {
        text-decoration: line-through;
    }

    button {
        border: none;
        cursor: pointer;
    }
</style>
<li class="item">
    <input type="checkbox">
    <label></label>
    <button>❌</button>
</li>
`;

export class TodoItem extends HTMLElement {
    private _shadowRoot: ShadowRoot;
    private item: HTMLLIElement;
    private removeButton: HTMLButtonElement;
    private label: HTMLLabelElement;
    private checkbox: HTMLInputElement;
    private _index: number = -1;
    private _text: string = '';
    private _checked: boolean = false;

    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        this.item = this._shadowRoot.querySelector('.item') as HTMLLIElement;
        this.removeButton = this._shadowRoot.querySelector('button') as HTMLButtonElement;
        this.label = this._shadowRoot.querySelector('label') as HTMLLabelElement;
        this.checkbox = this._shadowRoot.querySelector('input') as HTMLInputElement;

        this.removeButton.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('onRemove', { detail: this.index }));
        });

        this.checkbox.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('onToggle', { detail: this.index })); 
        });
    }

    get index() {
        return this._index;
    }

    set index(value: number) {
        this.setAttribute('index', value.toString());
    }

    get text(): string {
        return this.getAttribute('text') as string;
    }

    set text(text: string) {
        this.setAttribute('text', text);
    }

    get checked() {
        return this.hasAttribute('checked');
    }

    set checked(val) {
        if (val) {
            this.setAttribute('checked', '');
        } else {
            this.removeAttribute('checked');
        }
    }

    connectedCallback() {
        if (!this.hasAttribute('text')) {
            this.setAttribute('text', 'placeholder');
        }

        this._renderTodoItem();
    }

    _renderTodoItem() {
        if (this.hasAttribute('checked')) {
            this.item.classList.add('completed');
            this.checkbox.setAttribute('checked', '');
        } else {
            this.item.classList.remove('completed');
            this.checkbox.removeAttribute('checked');
        }

        this.label.innerHTML = this._text;
    }

    static get observedAttributes() {
        return ['text', 'checked', 'index'];
    }

    attributeChangedCallback(name: string, _: any, newValue: any) {
        switch (name) {
            case 'text':
                this._text = newValue;
                break;
            case 'checked':
                this._checked = this.hasAttribute('checked');
                break;
            case 'index':
                this._index = parseInt(newValue);
                break;
        }
    }
}

window.customElements.define('todo-item', TodoItem);
