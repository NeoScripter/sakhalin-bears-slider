import './style.css';

const SELECTORS = {
    NEXT_BTN: '.next-slide-btn',
    SLIDER_DOT: '.slider-dot',
    CARD: '.card',
};

const MODIFIERS = {
    HIDDEN_CARD: 'card-hidden',
    CURRENT_DOT: 'dot-current',
    CARD_OVERLAY: 'card-overlay',
};

class SliderHanlder {
    private currentCard: number;
    private cards: HTMLDivElement[];
    private dots: HTMLButtonElement[];

    constructor() {
        this.currentCard = 0;

        const cards = accessDomElements<HTMLDivElement>(
            SELECTORS.CARD,
            HTMLDivElement
        );
        this.cards = cards;

        const dots = accessDomElements<HTMLButtonElement>(
            SELECTORS.SLIDER_DOT,
            HTMLButtonElement
        );
        this.dots = dots;
    }

    init() {
        this.tick();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const nextBtn = accessDomElement(SELECTORS.NEXT_BTN, HTMLButtonElement);

        nextBtn.addEventListener('click', () => {
            this.currentCard =
                this.currentCard === this.cards.length - 1
                    ? 0
                    : this.currentCard + 1;

            this.tick();
        });

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.currentCard = index;
                this.tick();
            });
        });
    }

    tick() {
        this.cards.forEach((card, index) => {
            this.stripCardModifiers(card);
            if (index < this.currentCard) {
                card.classList.add(MODIFIERS.CARD_OVERLAY);
            } else if (index > this.currentCard) {
                card.classList.add(MODIFIERS.HIDDEN_CARD);
            }
        });

        this.dots.forEach((dot, index) => {
            dot.classList.remove(MODIFIERS.CURRENT_DOT);
            if (index === this.currentCard) {
                dot.classList.add(MODIFIERS.CURRENT_DOT);
            }
        });
    }

    stripCardModifiers(card: HTMLDivElement) {
        card.classList.remove(MODIFIERS.CARD_OVERLAY);
        card.classList.remove(MODIFIERS.HIDDEN_CARD);
    }
}

function accessDomElement<T extends Element>(
    selector: string,
    expectedElementType: new () => T,
    parent: HTMLElement = document.body
): T {
    const element = parent.querySelector(selector);

    if (!element) {
        throw new Error(`Element not found: ${selector}`);
    }

    if (!(element instanceof expectedElementType)) {
        throw new Error(
            `Expected ${expectedElementType.name}, but found ${element.constructor.name}`
        );
    }

    return element;
}

function accessDomElements<T extends Element>(
    selector: string,
    expectedElementType: new () => T,
    parent: HTMLElement = document.body
): T[] {
    const elements = Array.from(parent.querySelectorAll(selector));

    if (elements.length === 0) {
        throw new Error(`No elements found for selector: ${selector}`);
    }

    const filteredElements = elements.filter(
        (el): el is T => el instanceof expectedElementType
    );

    if (filteredElements.length !== elements.length) {
        throw new Error(
            `Some elements do not match expected type ${expectedElementType.name}`
        );
    }

    return filteredElements;
}

const sliderHandler = new SliderHanlder();

sliderHandler.init();
