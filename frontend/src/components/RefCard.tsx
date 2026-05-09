import '../reset.css';
import type { ingType } from '../types/type.ts';
import PlusIcon from '../img/Plus.svg';
import DeleteIcon from '../img/Delete.svg';

const getElaspedTime = (addedAt: string): string => {
    const addedDate = new Date(addedAt);
    const now = new Date();
    const elapsedTime = now.getTime() - addedDate.getTime();
    const elapsedDays = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
    return `${elapsedDays}日前`;
}

function RefCard({ ing, catId, catName, type, onClick }:
    { ing: ingType, catId: number, catName: string, type: "add" | "delete", onClick: (id: number) => void }) {
    return (
        <div key={ing.ing_id} className="card">
            <div className="card-row">
                <p className='name'>
                    {ing.ing_name}
                </p>

                <div className='card-right'>

                    <span className='elapsed-time'>
                        {getElaspedTime(ing.added_at)}
                    </span>
                    
                    <span className={`cat-name cat-${catId}`}>
                        {catName}
                    </span>

                    <button
                        className='icon-btn'
                        onClick={() => onClick(ing.ing_id)}
                    >
                        {type === "add"
                            ? <img src={PlusIcon} alt="Add" className='icon plus' />
                            : <img src={DeleteIcon} alt="Delete" className='icon delete' />
                        }
                    </button>
                </div>

            </div>
        </div>
    )
}

export default RefCard;
