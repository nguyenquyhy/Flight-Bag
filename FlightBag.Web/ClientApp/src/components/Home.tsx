import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';
import { Bag, BagItem } from '../Models';
import FlightBag from './FlightBag';
import FlightBagMSFS from './FlightBagMSFS';

const hub = new signalR.HubConnectionBuilder()
    .withUrl('/BagHub')
    .withAutomaticReconnect()
    .build();

const Home = (props: RouteComponentProps) => {
    const searchParams = new URLSearchParams(props.location.search);
    const mode = searchParams.get('mode');

    const [connected, updateConnected] = React.useState(false);
    const [bagCode, updateBagCode] = React.useState("");
    const [bag, updateBag] = React.useState<Bag>();

    React.useEffect(() => {
        const f = async () => {
            await hub.start();
            updateConnected(true);
        }
        f();
    }, []);

    hub.onclose = error => {
        updateConnected(false);
    }
    hub.onreconnected = () => {
        updateConnected(true);
    }
    hub.on("UpdateBag", bag => {
        updateBag(bag);
    });

    const handleNewBag = async () => {
        await hub.send("CreateBag");
    }

    const handleOpenBag = async () => {
        if (bagCode) {
            await hub.send("JoinBag", bagCode);
        }
    }

    if (!connected) {
        return <>Connecting...</>;
    }

    if (!bag) {
        if (localStorage) {
            const savedCode = localStorage.getItem('bagCode');
            if (savedCode) {
                hub.send("JoinBag", savedCode);
            }
        }

        return <>
            <div><button onClick={handleNewBag}>New flight bag</button></div>
            <div>
                <input value={bagCode} onChange={e => updateBagCode(e.target.value)} placeholder="Flight bag code" /><button onClick={handleOpenBag}>Open</button>
            </div>
        </>;
    }

    const handleCloseBag = () => {
        if (localStorage) {
            localStorage.removeItem('bagCode');
        }
        updateBag(undefined);
    }

    const handleAddItem = async (item: BagItem) => {
        bag.items.push(item);
        await hub.send("UpdateBag", bag);
    }

    const handleMoveUp = async (item: BagItem) => {
        const index = bag.items.findIndex(i => i === item);
        if (index > 0) {
            bag.items.splice(index, 1);
            bag.items.splice(index - 1, 0, item);
            await hub.send("UpdateBag", bag);
        }
    }

    const handleMoveDown = async (item: BagItem) => {
        const index = bag.items.findIndex(i => i === item);
        if (index < bag.items.length - 1) {
            bag.items.splice(index, 1);
            bag.items.splice(index + 1, 0, item);
            await hub.send("UpdateBag", bag);
        }
    }

    const handleRemove = async (item: BagItem) => {
        bag.items = bag.items.filter(i => i !== item);
        await hub.send("UpdateBag", bag);
    }

    if (localStorage) {
        localStorage.setItem('bagCode', bag.id);
    }

    return mode ==='MSFS' ? 
        <FlightBagMSFS hub={hub} bag={bag} 
            onClose={handleCloseBag}
            onAddItem={handleAddItem} /> :
        <FlightBag hub={hub} bag={bag} 
            onClose={handleCloseBag}
            onAddItem={handleAddItem}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onRemove={handleRemove} />;
}

export default Home;