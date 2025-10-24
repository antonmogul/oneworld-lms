export const maskEmail = (
  emailAddress: string
) => {
  let emailArr: string[];
  emailArr = emailAddress.split('');
  let finalArr=[];
  let len = emailArr.indexOf('@');
  emailArr.forEach((item, pos) => {
    (pos>=2 && pos<=len-3) ? finalArr.push('*') : finalArr.push(emailArr[pos]);
  })
  return finalArr.join('');
};

export default maskEmail;
