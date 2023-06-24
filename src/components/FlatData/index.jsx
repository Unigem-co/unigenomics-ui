import React, { useEffect, useState } from 'react'
import { request } from '../../utils/fetch';
import Table from '../../components/Table';
import Form from '../../components/Form';

const FlatData = (props) => {
  const {
    endpoint
  } = props;

  const [data, setData] = useState([]);
  const [schema, setSchema] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    request(endpoint, { method: 'GET' }, (d) => setData(d), onError);
    request(`${endpoint}/schema`, { method: 'GET' }, (s) => setSchema(s), onError);
  }, [endpoint]);

  const onCreate = () => {
    setShowForm(false);
    setSelectedRow({});
    setShowForm(true);
  }

  const onUpdate = value => {
    setShowForm(false);
    setSelectedRow(value);
    setShowForm(true);
  }

  const onDelete = async value => {
    await request(
        endpoint, 
        { method: 'DELETE', body: value }, 
        () => {
            setData(data.filter(gen => gen.id !== value.id));
            setShowForm(false);
        }, 
        onError
    );
  }

  const onError = (error) => {
    console.log(error);
  };

  const onSave = async (values) => {
    if(values.id) {
        await request(
            endpoint, 
            { method: 'PUT', body: values }, 
            () => {
                setData([...data.filter(d => d.id !== values.id), values]);
                setShowForm(false);
            }, 
            onError
            );
    } else {
        await request(
            endpoint, 
            { method: 'POST', body: values }, 
            (res) => { 
                setData([...data, {id: res.id, ...values}])
                setShowForm(false);
            }, 
            onError
        );
    }
  }

  const onCancel = () => setShowForm(false);

  return (
    <>
      <Table
        data={data}
        columns={schema}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
      {
      showForm && 
        <div className="side-form">
          <Form
            schema={schema}
            data={selectedRow}
            onSave={onSave}
            onCancel={onCancel}
          />
        </div>
      }
    </>
  )
}

export default FlatData