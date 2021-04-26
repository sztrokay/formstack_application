<script>
//fetching Courses API
var primaryUrl = "https://8bxi1poaqj.execute-api.eu-west-1.amazonaws.com/sssc/sssc-courses"
var secondaryUrl = "https://script.google.com/macros/s/AKfycbzG-rJapGn5WwiCSW19exulOGSZipNRwGG1H75wP-RxRnJjP7DoQig5lSlqhdlzjmFr/exec";
var href = window.location.href;
var coursesData = [];

window.addEventListener('DOMContentLoaded', function() {
    //Try fetching from Google API

    console.log('Fetching course information via AWS');
    fetch(primaryUrl)
    .then(res => res.json())
    .then(data => initiateForm(data.body))
    .catch(error => {
        //Try fetching via uoy server
        console.log('Cannot fetch via AWS, trying via Google');
        fetch(secondaryUrl)
        .then(res => res.json())
        .then(data => initiateForm(data))
        .catch(error => {
            //Log error in dropdown
            
            var errorMessage = 'No course available at the moment'

            var select = document.getElementById('field103015942');
            select.remove(0);
            var option = document.createElement("option");
            option.text=errorMessage;
            option.value="";
            select.add(option)

            document.getElementById('fsRow4174512-11').style.display = "none";//hide course name
            document.getElementById('fsRow4174512-12').style.display = "none";//hide start date
            document.getElementById('fsRow4174512-13').style.display = "none";//hide end date

        });
    });

    //AUTOFILL MODE
    function initiateForm(data){
        //Initiate change event type for despatch later
        var event = new Event('change');

        // Filter courses data based on location

        // When on online courses page, only show Open-access programmes but not Online tasters
        if (href.match(/online-courses/)) {
            coursesData = data.filter(function(course){
                return course.partner === "N/a" && course.type != "Online taster";
            });
        }

        // When on online tasters page, only show online tasters, including the ICA
        else if(href.match(/online-tasters/)){
            coursesData = data.filter(function(course){
                return course.type === "Online taster";
            }); 
        }
        // If course is not specified, only list open-access programmes
        else if(!href.match(/Select%20course=/)){
            coursesData = data.filter(function(course){
                return course.partner === "N/a";
            });          
        }

        // In any other cases, do not filter programmes
        else {
            coursesData = data;
        }
        
        // Check if a course is likely to be specified in the query string and extract it
        if (href.match(/Select%20course=/)){
            var courseCodeFromQuery = href.split('Select%20course=')[1]
            if (courseCodeFromQuery.match(/&/)){
                courseCodeFromQuery = courseCodeFromQuery.split('&')[0]
            }
            //Select the course based on the query
            var courseFromQuery = data.find(function(courseFromQuery){
                return courseFromQuery.code == courseCodeFromQuery;
            });
            if (!courseFromQuery){
                coursesData = data.filter(function(course){
                    return course.partner === "N/a";
                });  
            }
        }
        else{
            var courseCodeFromQuery = null;
        }

        //This is the select option for courses
        var select = document.getElementById('field103015942');

        //Remove "Loading" option from select
        select.remove(0);
        //Create course options in dropdown

        var option = document.createElement("option");
        option.value = "";
        option.text = "";
        select.add(option);

        //Append any courses as options to course select, as per the filter above
        for (var course in coursesData){
            option = document.createElement("option");
            option.value = coursesData[course].code;
            option.text = coursesData[course].name;
            select.add(option);
        }


        //If course was found based on query, get its details and select form options using those
        if (courseFromQuery){
            //Hide dropdown field
            document.getElementById('fsRow4174512-10').style.display = "none";
            var courseName = courseFromQuery.name; //Course name
            var startDate = courseFromQuery.arrival; //Course start date
            var endDate = courseFromQuery.departure; //Course end date
            
            //Homestay
            var homestay = courseFromQuery.homestay;
            if (homestay == true){
                var element = document.getElementById('field103015935_1');
                element.checked = true;
                element.dispatchEvent(event);
            }
            else{
                var element = document.getElementById('field103015935_2');
                element.checked = true;
                element.dispatchEvent(event);
            }

            //Campus
            var campus = courseFromQuery.campus;
            if (campus == true){
                element = document.getElementById('field103015936_1');
                element.checked = true;
                element.dispatchEvent(event);
            }
            else{
                element = document.getElementById('field103015936_2');
                element.checked = true;
                element.dispatchEvent(event);
            }
            
            //AM/PM
            var ampm = courseFromQuery.ampm;
            if (ampm == true){
                element = document.getElementById('field103015940_1');
                element.checked = true;
                element.dispatchEvent(event);
            }
            else{
                element = document.getElementById('field103015940_2');
                element.checked = true;
                element.dispatchEvent(event);
            }
            //Combined accommodation
            
            if (homestay == true || campus == true){
                element = document.getElementById('field103015934_1');
                element.checked = true;
                element.dispatchEvent(event);
            }
            else{
                element = document.getElementById('field103015934_2');
                element.checked = true;
                element.dispatchEvent(event);
            }
            
            //Individual Payment
            var indivPay = courseFromQuery.indivPay;
            if (indivPay == true){
                element = document.getElementById('field103015937_1');
                element.checked = true;
                element.dispatchEvent(event);
            }
            else{
                element = document.getElementById('field103015937_2');
                element.checked = true;
                element.dispatchEvent(event);
            }
            
            //Course type
            var type = courseFromQuery.type;
            element = document.getElementById('field103015938');
            element.value = type;
            element.dispatchEvent(event);
            
            //Scholarships
            var scholarship = courseFromQuery.scholarship
            if (scholarship == true){
                element = document.getElementById('field103015939_1');
                element.checked = true;
                element.dispatchEvent(event);
            }
            else{
                element = document.getElementById('field103015939_2');
                element.checked = true;
                element.dispatchEvent(event);
            }

            var partner = courseFromQuery.partner//Partner university
            document.getElementById('field103015963').value = partner;
            document.getElementById('field103015942').value = courseCodeFromQuery; //Course code
            document.getElementById('field103015943').value = courseName; //Course name
            document.getElementById('field103015944').value = startDate; //Course start date
            document.getElementById('field103015945').value = endDate; //Course end date
        }
        //If course was not found, hide course name field
        else {
            document.getElementById('fsRow4174512-11').style.display = "none";
        }
    
        //Add event listener to course select
        document.getElementById('field103015942').addEventListener("change", function() {
            var event = new Event('change');
            // Get selected course from coursesData, based on its course code
            var thisCode =  document.getElementById('field103015942').value;
            var newCourse = coursesData.find(function(course){
                return course.code == thisCode;
            });

            document.getElementById('field103015943').value = newCourse.name + " course";
            document.getElementById('field103015944').value = newCourse.arrival;
            document.getElementById('field103015945').value = newCourse.departure;
            

            //Homestay option
            var homestay = newCourse.homestay;
            if (homestay == true){
                var element = document.getElementById('field103015935_1');
                element.checked = true;
                element.dispatchEvent(event);
            }
            else {
                var element = document.getElementById('field103015935_2');
                element.checked = true;
                element.dispatchEvent(event);
            }

            
            //Campus option
            var campus = newCourse.campus;
            if (campus == true){
                element = document.getElementById('field103015936_1');
                element.checked = true;
                element.dispatchEvent(event);
            }
            else {
                element = document.getElementById('field103015936_2');
                element.checked = true;
                element.dispatchEvent(event);
            }

                
            //AM/PM option
            var ampm = newCourse.ampm;
            if (ampm == true) {
                element = document.getElementById('field103015940_1');
                element.checked = true;
                element.dispatchEvent(event);
            }
            else{
                element = document.getElementById('field103015940_2');
                element.checked = true;
                element.dispatchEvent(event);
            }

            
            //Combined accommodation indicator
            if (homestay == true || campus == true) {
                element = document.getElementById('field103015934_1');
                element.checked = true;
                element.dispatchEvent(event);
            }
            else{
                element = document.getElementById('field103015934_2');
                element.checked = true;
                element.dispatchEvent(event);
            }

                
            //Individual Payment option
            var indivPay = newCourse.indivPay;
            if (indivPay == true) {           
                element = document.getElementById('field103015937_1');
                element.checked = true;
                element.dispatchEvent(event);
            }
            else{            
                element = document.getElementById('field103015937_2');
                element.checked = true;
                element.dispatchEvent(event);
            }

            
            //Course type
            var type = newCourse.type;
            element = document.getElementById('field103015938');
            element.value = type;
            element.dispatchEvent(event);
            
            //Scholarships
            var scholarship = newCourse.scholarship
            if (scholarship == true){          
                element = document.getElementById('field103015939_1');
                element.checked = true;
                element.dispatchEvent(event);
            }
            else{           
                element = document.getElementById('field103015939_2');
                element.checked = true;
                element.dispatchEvent(event);
            }
        
            var partner = newCourse.partner//Partner university
            document.getElementById('field103015963').value = partner;
        });
  
        //Add event listener to country code box
        document.getElementById('field105126989').addEventListener("change", function() {
            var phoneBox = document.getElementById('field103015954');
            var countryCode = document.getElementById('field105126989').value;
            phoneBox.value = '00 '+countryCode + ' ';
        });
        

        //Add event listener to EC country code box
        document.getElementById('field105271219').addEventListener("change", function() {
            var ecPhoneBox = document.getElementById('field103015998');
            var ecCountryCode = document.getElementById('field105271219').value;
            ecPhoneBox.value = '00 '+ecCountryCode + ' ';
        });
    }
});

</script>
