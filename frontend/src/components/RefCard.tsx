import { Plus, Trash2 } from 'lucide-react';
import type { ingType } from '../types/type.ts';

type RefCardProps = {
    ing: ingType;
    catId: number;
    catName: string;
    type: "add" | "delete";
    onClick: (ingId: number) => void;
}

function RefCard({ ing, catId, catName, type, onClick }: RefCardProps) {

    return (
        <div key={ing.ing_id} className="card inner-wrap">
            <div>
                <p className='name'>{ing.ing_name}</p>
                <p className={`cat-name cat-${catId}`}>{catName}</p>
            </div>
            <div className="btn-container">
                <button className={`btn-sub ${type}`} onClick={() => onClick(ing.ing_id)}>
                    {type === "add" ? <Plus className='lucide-icon' /> : <Trash2 className='lucide-icon' />}
                </button>
            </div>
        </div>
    )
}

export default RefCard;
