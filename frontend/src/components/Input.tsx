import '../reset.css';
import './Input.css';

function Input({ word, setWord, placeholder }:
    { word: string; setWord: (value: string) => void; placeholder: string }) {

    return (
        <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder={placeholder}
        />
    );
};

export default Input;