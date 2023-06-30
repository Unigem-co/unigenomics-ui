import React from 'react'
import DependentData from '../../components/DependentData';

const dependencies = {
	role: {
		displayValue: 'role',
		data: [
			{
				id: 'user',
				role: 'user',
			},
			{
				id: 'admin',
				role: 'admin',
			},
		],
	},
	document_type: {
		displayValue: 'documentType',
		data: [
			{
				id: 'C.C',
				documentType: 'C.C',
			},
			{
				id: 'Passport',
				documentType: 'Passport',
			},
		],
	},
};
const Users = () => {
  return <DependentData endpoint='users/user' dependencies={dependencies} />;
}

export default Users