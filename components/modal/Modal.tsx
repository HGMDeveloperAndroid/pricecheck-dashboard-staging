import React, { PureComponent } from 'react'

import styles from './modal.module.scss'

type Props = {
    showModal: boolean,
    closeModal?: Function,
    containerWidth?: string,
    noPadding?: boolean,
    isImageModal?: boolean,
    onKeyDown?: Function,
}


export default class Modal extends PureComponent<Props> {
    static defaultProps = {
        isImageModal: false,
    }
    handleEscapeKey = (event: KeyboardEvent) => {
        if (this.props.isImageModal === true) {
            if ((event.keyCode === 27 || event.keyCode === 17 || event.keyCode === 88 || event.keyCode === 18) && this.props.closeModal) {
                this.props.closeModal();
            }
        } else {
            if (event.keyCode === 27 && this.props.closeModal) {
                this.props.closeModal();
            }
        }
    };

    handleCloseModal = (event: React.MouseEvent<HTMLDivElement>) => {
        if (this.props.closeModal) {
            this.props.closeModal();
        }
    };

    handleKeyModal = (e: any) => {
        if (this.props.isImageModal === true) {
            if ( e.keyCode  === 17 || e.keyCode === 17)  {
                // Escape key pressed
                this.props.closeModal();
            }
        } else {
            if (e.keyCode === 17) {
                // Escape key pressed
                this.props.closeModal();
            }
        }
    }

    componentDidUpdate() {
        if (this.props.showModal) {
            document.addEventListener('keyup', this.handleEscapeKey);
        } else {
            document.removeEventListener('keyup', this.handleEscapeKey);
        }
    }

    render() {
        const { showModal, containerWidth, noPadding, onKeyDown, isImageModal } = this.props
        let containerStyle: { [key: string]: any } = {}

        if (!showModal) {
            return null;
        }

        if (containerWidth) {
            containerStyle['width'] = containerWidth
        }

        if (noPadding) {
            containerStyle['padding'] = '10px'
        }

        return (
            <div className={styles.modalContainer}>
                <div className={styles.background} onKeyDown={(e) => this.handleKeyModal(e)} onClick={this.handleCloseModal} />
                <div style={containerStyle} className={styles.modal}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
