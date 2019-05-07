'use strict';

export class Carousel {
    constructor(option) {
        this.option = option
        this.cursor = null
        this.preview = []
        this.thumbnail = []
    }

    init(initIndex) {
        // makeCarousel
        this.carousel = this.makeCarousel()
        document.body.appendChild(this.carousel)

        // render
        if (initIndex > this.option.numOfItems - 1) {
            initIndex = initIndex % this.option.numOfItems // 繰り上げ
        }
        this.render(initIndex)
    }

    makeCarousel() {
        const carousel = document.createElement('div')

        carousel.classList.add('carousel')

        // 固有のwidth
        if (this.option.width) {
            carousel.style.width = this.option.width
        }

        // コントローラのon/off
        if (this.option.controller) {
            carousel.appendChild(this.makeController())
        }

        carousel.appendChild(this.makePreview())
        carousel.appendChild(this.makeThumbnail())

        return carousel
    }

    makeCarouselTreeFromTemplate() {

    }

    // generate control-buttons
    makeController() {
        const controlButtons = document.createElement('div')
        controlButtons.classList.add('control-buttons')
        const prev = document.createElement('div')
        prev.classList.add('prev')
        prev.style.backgroundImage = `url('images/prev.png')`
        const next = document.createElement('div')
        next.classList.add('next')
        next.style.backgroundImage = `url('images/next.png')`
        prev.addEventListener('click', () => {
            let nextCursor = this.cursor - 1
            if (nextCursor < 0) {
                nextCursor = this.option.numOfItems - 1
            }
            this.render(nextCursor, 'control')
        })
        next.addEventListener('click', () => {
            let nextCursor = this.cursor + 1
            if (nextCursor > this.option.numOfItems - 1) {
                nextCursor = 0
            }
            this.render(nextCursor, 'control')
        })

        controlButtons.appendChild(prev)
        controlButtons.appendChild(next)


        return controlButtons
    }


    // generate preview-frame
    makePreview() {
        const previewFrame = document.createElement('div')
        previewFrame.classList.add('preview-frame')
        const previewFragment = document.createDocumentFragment()
        for (let i = 0; i < this.option.numOfItems; i++) {
            const preview = document.createElement('div')
            preview.classList.add('preview')
            preview.classList.add('to-left') // 初期位置左側
            const previewImage = document.createElement('img')
            previewImage.classList.add('preview-image')
            previewImage.src = `images/${this.option.name}${i}.${this.option.imgType}`
            previewImage.alt = `${this.option.name}${i}`
            const previewLabelCushion = document.createElement('div')
            previewLabelCushion.classList.add('preview-label-cushion')

            preview.appendChild(previewImage)
            preview.appendChild(previewLabelCushion)

            // ラベルon/off
            if (this.option.label) {
                const previewLabel = document.createElement('div')
                previewLabel.classList.add('preview-label')
                previewLabel.appendChild(document.createTextNode(`${this.option.name}${i}`))
                preview.appendChild(previewLabel)
            }

            previewFragment.appendChild(preview)

            this.preview.push(preview)
        }
        previewFrame.appendChild(previewFragment)
        return previewFrame
    }

    // generate thumbnail-frame
    makeThumbnail() {
        const thumbnailFrame = document.createElement('div')
        thumbnailFrame.classList.add('thumbnail-frame')
        const thumbnailFragment = document.createDocumentFragment()
        for (let i = 0; i < this.option.numOfItems; i++) {
            const thumbnail = document.createElement('div')
            thumbnail.classList.add('thumbnail')
            thumbnail.style.backgroundImage = `url('images/${this.option.name}${i}.${this.option.imgType}')`
            thumbnail.dataset.index = i
            const thumbnailCover = document.createElement('div')
            thumbnailCover.classList.add('thumbnail-cover')

            // ラベルon/off
            if (this.option.label) {
                const thumbnailLabel = document.createElement('div')
                thumbnailLabel.classList.add('thumbnail-label')
                thumbnailLabel.appendChild(document.createTextNode(`${this.option.name}${i}`))
                thumbnailLabel.addEventListener('click', (e) => {
                    let nextCursor = e.target.parentNode.parentNode.dataset.index
                    this.render(nextCursor)
                })
                thumbnailCover.appendChild(thumbnailLabel)
            } else {
                thumbnailCover.addEventListener('click', (e) => {
                    let nextCursor = e.target.parentNode.dataset.index
                    this.render(nextCursor)
                })
            }

            thumbnail.appendChild(thumbnailCover)
            thumbnailFragment.appendChild(thumbnail)
            this.thumbnail.push(thumbnail)
        }
        thumbnailFrame.appendChild(thumbnailFragment)
        return thumbnailFrame
    }


    render(nextCursor, event = 'thumbnail') {
        nextCursor = parseInt(nextCursor) // どうしてもdata-indexは文字列に、配列番号は数値になってしまうので

        this.updatePreview(nextCursor, event)
        this.updateThumbnail(nextCursor)

        this.cursor = nextCursor
    }


    slideToRight(thisCursorPreview, nextCursorPreview) {
        thisCursorPreview.animate([
            {left: '0'},
            {left: '100%'},
        ], {fill: "forwards", duration: 300})

        nextCursorPreview.animate([
            {left: '-100%'},
            {left: '0'}
        ], {fill: "forwards", duration: 300})
    }

    slideToLeft(thisCursorPreview, nextCursorPreview) {
        thisCursorPreview.animate([
            {left: '0'},
            {left: '-100%'},
        ], {fill: "forwards", duration: 300})

        nextCursorPreview.animate([
            {left: '100%'},
            {left: '0'}
        ], {fill: "forwards", duration: 300})
    }

    updatePreview(nextCursor, event) {
        if (this.cursor === null) { // init
            // transitionなしで登場
            const nextCursorPreview = this.preview[nextCursor]
            nextCursorPreview.classList.remove('to-left')
        } else {
            if (this.cursor === 0
                && nextCursor === this.option.numOfItems - 1
                && event === 'control') {
                // 左から最後の画像がスライディング
                const thisCursorPreview = this.preview[this.cursor]
                const nextCursorPreview = this.preview[nextCursor]
                this.slideToRight(thisCursorPreview, nextCursorPreview)
            } else if (this.cursor === this.option.numOfItems - 1
                && nextCursor === 0
                && event === 'control') {
                // 右から最初の画像がスライディング
                const thisCursorPreview = this.preview[this.cursor]
                const nextCursorPreview = this.preview[nextCursor]
                this.slideToLeft(thisCursorPreview, nextCursorPreview)
            } else if (this.cursor > nextCursor) {
                // 左から前の画像がスライディング
                const thisCursorPreview = this.preview[this.cursor]
                const nextCursorPreview = this.preview[nextCursor]
                this.slideToRight(thisCursorPreview, nextCursorPreview)
            } else if (this.cursor < nextCursor) {
                // 右から次の画像がスライディング
                const thisCursorPreview = this.preview[this.cursor]
                const nextCursorPreview = this.preview[nextCursor]
                this.slideToLeft(thisCursorPreview, nextCursorPreview)
            } else {
                // ?
            }
        }
    }

    updateThumbnail(nextCursor) {
        const nextCursorThumbnail = this.thumbnail[nextCursor]

        if (this.cursor === null) { // init
            nextCursorThumbnail.classList.add('active')
        } else {
            const thisCursorThumbnail = this.thumbnail[this.cursor]

            thisCursorThumbnail.classList.remove('active')
            nextCursorThumbnail.classList.add('active')
        }
    }
}
