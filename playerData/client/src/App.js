import './App.css';
import React, { useState, useEffect, useRef } from 'react';

const Header = () => {
  return (
    <>
      <h1>Player Fifa Database</h1>
  </>
  );
};


const List = ({ player, onInputChange, onDropInputChange, onClickSubmit, onClickDelete }) => {
  return (
    <ul>
      {player.map((player,index) => (
        <li key={player._id}  className='item'>
          {Object.entries(player).map(([key, value]) => {
            if (key === '_id') return null;
            if (key === 'Drops') {
              return (
                <ul key={key}>
                  {value.map(drop => (
                    <li key={drop._id}>
                      {Object.entries(drop).map(([dropKey, dropValue]) => {
                        if (dropKey === '_id') return null;
                        return (
                          <form key={dropKey}>
                            <label>
                              {dropKey}:
                              <input
                                type="text"
                                value={dropValue}
                                onChange={e =>
                                  onDropInputChange(player._id, drop._id, dropKey, e.target.value)
                                }
                              />
                            </label>
                          </form>
                        );
                      })}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <form key={key}>
                <label>
                  {key}:<br></br>
                  <input
                    type="text"
                    value={value}
                    onChange={e => onInputChange(player._id, key, e.target.value)}
                  />
                </label>
              </form>
            );
          })}
          <button onClick={(e)=>{onClickDelete(player._id)}} id="delete">
          Delete
          </button>
          <button onClick={(e)=>{onClickSubmit(player._id,index)}} id="update">
          Update
          </button>
        </li>
      ))}
    </ul>
  );
};

const Modal=({isOpen,setIsOpen,handlePost})=>{
  const [clicked,setClicked] = useState(1);
  const formRef=useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const formValues = {};
    for (const [name, value] of formData.entries()) {
      if(name.startsWith('Drops')){
        let index=name.replace('Drops','');
        const i=name[name.length-1];
        index=index.replace(i,'');
        if(!formValues['Drops']){
          formValues['Drops']=[];
        }
        if(!formValues['Drops'][i]){
          formValues['Drops'][i]={};
        }
        

      }
    }
  
    console.log(JSON.stringify(formValues));
    handlePost(formValues);
  };


  return isOpen ? (
    <div className='modal-overlay'>
    <div  className='modal'>
      <h2>Introduceti un playercard</h2>
      <div  className='modal-content'>
      <form ref={formRef}  onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" required name='Name'/>
        <label>Rarity</label>
        <input type="text" required name='Rarity'/>
        <button type="submit">Submit</button>
      </form>
      <button onClick={() => setIsOpen(false)}>Close</button>
      </div>
    </div>
    </div>
  ) : null;
}


const App = () => {
  const [newJson, setNewJson] = useState([]);
  const [isOpen,setIsOpen]  = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5050/Player/', { method: 'GET' });
        const json = await response.json();
        setNewJson(json);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleOnClickPost= async (formValues)=>{
    try{
      fetch('http://localhost:5050/Player/' , {method: 'POST', headers:{'Content-Type':'application/json'} ,body: JSON.stringify(formValues)});
      const response = await fetch('http://localhost:5050/Player/', { method: 'GET' });
      const json=await response.json();
      setNewJson(json);
      window.location.reload(false);
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleOnClickSubmit= async (_id,i)=>{
    try{
      fetch('http://localhost:5050/Player/'+_id , {method: 'PATCH', headers:{'Content-Type':'application/json'} ,body: JSON.stringify(newJson[i])});
      console.log(JSON.stringify(newJson[i]));
      const response = await fetch('http://localhost:5050/Player/', { method: 'GET' });
      const json=await response.json();
      setNewJson(json);
      window.location.reload(false);
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  const handleInputChange = (id, key, value) => {
    setNewJson(prevJson =>
      prevJson.map(d => {
        if (d._id === id) {
          return { ...d, [key]: value };
        }
        return d;
      })
    );
  };

  const handleDropInputChange = (id, dropId, key, value) => {
    setNewJson(prevJson =>
      prevJson.map(d => {
        if (d._id === id) {
          const updatedDrops = d.Drops.map(drop => {
            if (drop._id === dropId) {
              return { ...drop, [key]: value };
            }
            return drop;
          });
          return { ...d, Drops: updatedDrops };
        }
        return d;
      })
    );
  };

  
  const handleOnClickDelete= async (_id)=>{
    try{
      fetch('http://localhost:5050/Player/'+_id , {method: 'DELETE'});
      const response = await fetch('http://localhost:5050/Player/', { method: 'GET' });
      const json=await response.json();
      setNewJson(json);
      window.location.reload(false);
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <>
    <header>
      <Header/>
      <nav>
          <img src='./poza.png'></img>
      </nav>
    </header>
    {isOpen &&<Modal isOpen={isOpen} setIsOpen={setIsOpen} handlePost={handleOnClickPost}/>}
    <main>
    <button id="AddButton" onClick={()=>{setIsOpen(true)}}>Add player</button>
      <List
        player={newJson}
        onInputChange={handleInputChange}
        onDropInputChange={handleDropInputChange}
        onClickDelete={handleOnClickDelete}
        onClickSubmit={handleOnClickSubmit}
      />
      </main>
    </>
  );
};

export default App;
