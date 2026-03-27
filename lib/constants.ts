export interface Event {
   id: number;
   title: string;
   image: string;
   date: string;
   time: string;
   location: string;
   description: string;
   category: 'conference' | 'hackathon' | 'meetup';
}

export const events: Event[] = [
   {
      id: 1,
      title: 'React Summit 2026',
      image: '/images/event1.png',
      date: 'June 8-9, 2026',
      time: '9:00 AM',
      location: 'Amsterdam, Netherlands',
      description: 'The biggest React conference with talks from industry leaders and workshops.',
      category: 'conference',
   },
   {
      id: 2,
      title: 'Next.js Conf 2026',
      image: '/images/event2.png',
      date: 'October 26, 2026',
      time: '10:00 AM',
      location: 'San Francisco, CA',
      description: 'The official Next.js conference featuring new releases and best practices.',
      category: 'conference',
   },
   {
      id: 3,
      title: 'TechCrunch Disrupt 2026',
      image: '/images/event3.png',
      time: '8:30 AM',
      date: 'September 12-14, 2026',
      location: 'San Francisco, CA',
      description: 'The ultimate showcase for startups and innovations in tech.',
      category: 'conference',
   },
   {
      id: 4,
      title: 'HackMIT 2026',
      image: '/images/event4.png',
      time: '6:00 PM',
      date: 'April 17-19, 2026',
      location: 'Cambridge, MA',
      description: 'One of the largest hackathons featuring 3000+ developers and $50k+ in prizes.',
      category: 'hackathon',
   },
   {
      id: 5,
      title: 'MLOps Community Meetup',
      time: '6:30 PM',
      image: '/images/event5.png',
      date: 'April 2, 2026',
      location: 'New York, NY',
      description: 'Monthly meetup discussing machine learning operations and best practices.',
      category: 'meetup',
   },
   {
      id: 6,
      title: 'Web3 Summit 2026',
      time: '9:30 AM',
      image: '/images/event6.png',
      date: 'May 22-24, 2026',
      location: 'Berlin, Germany',
      description: 'The leading summit for blockchain, crypto, and decentralized technology.',
      category: 'conference',
   },
];
