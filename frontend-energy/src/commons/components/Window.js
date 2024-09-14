import React, { useState } from 'react';

const Window = ({ isOpen, onClose, onSubmit }) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = () => {
        onSubmit(inputValue);
        setInputValue('');
        onClose();
    };

    return (
        <div className={`window ${isOpen ? 'open' : ''}`}>
            <div className="window-content">
                <h2>Window Title</h2>
                <input
                    type="text"
                    placeholder="Enter something"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Window;
