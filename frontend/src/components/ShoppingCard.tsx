import type { ingType } from '../types/type.ts';
import PlusIcon from '../img/Plus.svg';
import CheckIcon from '../img/Check.svg';
import '../reset.css';

function ShoppingCard({ ing, catId, catName, type, onClick }:
    { ing: ingType, catId: number, catName: string, type: "add" | "delete", onClick: (id: number) => void }) {
    return (
        <div key={ing.ing_id} className="card">
            <div className='card-row'>
                <p className='name'>
                    {ing.ing_name}
                </p>

                <div className='card-right'>
                    <span className={`cat-name cat-${catId}`}>
                        {catName}
                    </span>

                    <button
                        className='icon-btn'
                        onClick={() => onClick(ing.ing_id)}
                    >
                        {type === "add"
                            ? <img src={PlusIcon} alt="Add" className='icon' />
                            : <img src={CheckIcon} alt="Check" className='icon' />
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ShoppingCard;