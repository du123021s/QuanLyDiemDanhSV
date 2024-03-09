import handlebars from 'hbs';
import moment from 'moment';

handlebars.registerHelper('formatDate', function (date) {
  // Chuyển đổi ngày thành chuỗi ngày tháng
  return moment(date).format('DD/MM/YYYY');
});

export default handlebars;
