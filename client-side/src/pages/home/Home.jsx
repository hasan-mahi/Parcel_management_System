import React from 'react';
import Banner from './banner/Banner';
import Services from './services/Services';
import ClientsSection from './clientLogosMarquee/ClientsSection';
import Benefit from './Benefit/Benefit';
import BeMerchant from './beMerchant/BeMerchant';
import HowItWorks from './howItWorks/HowItWorks';
import Review from './review/Review';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <HowItWorks></HowItWorks>
            <Services></Services>
            <ClientsSection></ClientsSection>
            <Benefit></Benefit>
            <BeMerchant></BeMerchant>
            <Review></Review>
        </div>
    );
};

export default Home;