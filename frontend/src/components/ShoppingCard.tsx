import { Plus, Trash2 } from 'lucide-react';
import type { ingType } from '../types/type.ts';

function ShoppingCard({ ing, catId, catName, type, onClick }: 
    { ing: ingType, catId: number, catName: string, type: "add" | "delete", onClick: (id: number) => void }) {
    return (
        <div key={ing.ing_id} className="card inner-wrap">
            <div>
                <p className='name'>{ing.ing_name} </p>
                <div className='inner-wrap'>
                    <p className={`cat-name cat-${catId}`}>{catName}</p>
                </div>
            </div>
            <div className="btn-container">
                <button className={`btn-sub ${type}`} onClick={() => onClick(ing.ing_id)}>
                    {type === "add" ? <Plus className='lucide-icon' /> : <Trash2 className='lucide-icon' />}
                </button>
            </div>
        </div>
    )
}

export default ShoppingCard;