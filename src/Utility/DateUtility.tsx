const formatDate=(dateString: any ) =>{
    if(!dateString) {
        return undefined;}
const months = [
"January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];
const date = new Date(dateString);
const day = date.getDate();
const month = months[date.getMonth()];
const year = date.getFullYear();
return `${day} ${month} ${year}`;
}  
const formatDateWithTime = (dateString: any) => {
  if (!dateString) {
    return undefined;
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12; // convert to 12-hour format

  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
};


export {formatDate,formatDateWithTime} ;