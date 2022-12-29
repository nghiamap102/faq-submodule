export class PopupManager
{
    popups = [];
    static instance;

    static init()
    {
        if (!this.instance)
        {
            this.instance = new PopupManager();
            document.addEventListener('keydown', this.instance.handleKeydown.bind(this.instance), false);

            return this.instance;
        }
    }

    handleKeydown(event)
    {
        if (event.code === 'Escape')
        {
            const popup = this.popups[this.popups.length - 1];
            if (popup)
            {
                popup.handleClose();
            }
        }
    }

    add(popup)
    {
        this.popups.map(popup => popup.setTopPopup(false));
        this.popups.push(popup);
    }

    remove(popup)
    {
        this.popups = this.popups.filter((p) => p !== popup);
        this.popups.map((popup, index) => popup.setTopPopup(index === this.popups.length - 1));
    }
}
