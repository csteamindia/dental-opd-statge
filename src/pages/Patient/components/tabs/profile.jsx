import React from 'react';
import AddPatient from '../addPatient';

const Profile = ({patientData}) => {
    return(
        <AddPatient patientData={patientData} is_update={true}/>
    )
}

export default Profile;