import React from 'react';
import logo from '../../../assets/logo.png'
import { Link } from 'react-router';

const ProFastLogo = () => {
    return (
        <div className='flex items-end'>
            <img src={logo} alt="" className='mb-2' />
            <Link to='/' className='text-3xl font-bold -ml-2'>ProFast</Link>
        </div>
    );
};

export default ProFastLogo;