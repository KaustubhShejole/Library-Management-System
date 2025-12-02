//jshint esversion: 8
const express = require("express");
var router = express.Router();
var book_index = 1;

const csv = require('csv-parser');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Import models and database connection
const Item = require("./models/item");
const Student = require("./models/student");
const Category = require("./models/category");
const Subject = require("./models/subject");
const Faculty = require("./models/faculty");



require("./database");

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));/////to addd css to our home page
app.use(bodyParser.json());
mongoose.connect("mongodb://localhost:27017/libraryDB", { useNewUrlParser: true });////connecting mongoose
/////////////here we have connected mongoose sever and created the database todolistDB

function sortArrayByProperty(arr, property) {
    return arr.sort((a, b) => {
        const valueA = a[property].toLowerCase();
        const valueB = b[property].toLowerCase();

        if (valueA < valueB) {
            return -1;
        }
        if (valueA > valueB) {
            return 1;
        }
        return 0;
    });
}

////creating and defining the itemschema
const defaultItems = [];// = [item1];
function getBooksCountFromDataSource(callback) {
    Item.countDocuments({}, function(err, count) {
        if (err) {
            console.log("Error occurred while counting fruits:", err);
            callback(err, null);
        } else {
            console.log("Total number of fruits:", count);
            callback(null, count);
        }
    });
}
app.get("/", function (req, res) {

  getBooksCountFromDataSource(function(err, count) {
    if (err) {
        console.log(err);// Handle error
    } else {
        // 'count' contains the total number of fruits
        res.render('list', { booksCount: count });
        // Pass 'count' to your rendering function or wherever you need to use it
    }
}); // Replace this with your logic to get the count

  //  res.render("list",{});
});


app.post("/", function (req, res) {
    console.log("home /");



    res.redirect("/");
    // res.send("hello");
});
app.post('/home', function (req, res) {
  res.render("list", {});
});
app.get("/records", function (req, res) {

    console.log("/records");

    Item.find({}, function (err, foundItems) {

            res.render("records", { listTitle: "user t sys", newListItems: foundItems });

    });
});
app.post("/delete", function (req, res) {
    const checkeditem = req.body.itemId;
    console.log("id is" + checkeditem);
    const parentHref = req.body.parentHref; // Access parent_href from request body
    console.log(String(parentHref));
    Item.findByIdAndRemove(checkeditem, function (err) {
        if (!err) {
            console.log("successfully deleted");
            // Send a pop-up alert for successful deletion
            res.send("<script>alert('Delete Successful'); window.location.href = '" + parentHref + "';</script>");
        } else {
            console.log(err);
            console.log("Delete operation failed");
            // Handle error accordingly
            res.status(500).send("Delete operation failed");
        }
    });
  });
  app.post("/delete_student", function (req, res) {
      const checkeditem = req.body.itemId;
      console.log("id is" + checkeditem);
      const parentHref = req.body.parentHref; // Access parent_href from request body
      console.log(String(parentHref));
      Student.findByIdAndRemove(checkeditem, function (err) {
          if (!err) {
              console.log("successfully deleted");
              // Send a pop-up alert for successful deletion
              res.send("<script>alert('Delete Successful'); window.location.href = '" + parentHref + "';</script>");
          } else {
              console.log(err);
              console.log("Delete operation failed");
              // Handle error accordingly
              res.status(500).send("Delete operation failed");
          }
      });
    });


  app.post("/update", function(req, res) {
    const itemId = req.body.itemId; // Retrieve the item ID
    authors = req.body.authors;
    // Check if authors is an array
    if (Array.isArray(authors)) {
        // Filter out empty or whitespace-only strings
        authors = authors.filter(str => str.trim() !== "");
    } else {
        // If authors is not an array, convert it to an array with a single element
        authors = [authors];
    }
    const updatedItem = {
        serial_number: req.body.sn,
        title: req.body.title,
        author: authors, // Convert comma-separated string to an array
        publication: req.body.publication,
        isbn: req.body.isbn,
        subject: req.body.subject
    };
    const parentHref = req.body.parentHref; // Retrieve the parentHref value from the form
    console.log('post'+parentHref);
    Item.findByIdAndUpdate(itemId, updatedItem, { new: true }, function(err, updatedItem) {
        if (err) {
            console.log("Error updating item:", err);
            // Handle error accordingly
            res.status(500).send("Update operation failed");
        } else {
            console.log("Item updated successfully:", updatedItem);
            // Redirect or render success page
            res.send("<script>alert('Item updated successfully');  window.location.href = '" + parentHref + "';</script>");
        }
    });
});
app.post("/update_student", function(req, res) {
  const itemId = req.body.itemId; // Retrieve the item ID
  const updatedItem = {
    student_id: req.body.student_id,
    name: req.body.name,
    contact_number: req.body.contact_number,
    enrol_id: req.body.enrol_id,
    numBooksBorrowed: req.body.numBooksBorrowed
};
  const parentHref = req.body.parentHref; // Retrieve the parentHref value from the form
  console.log('post'+parentHref);
  Student.findByIdAndUpdate(itemId, updatedItem, { new: true }, function(err, updatedItem) {
      if (err) {
          console.log("Error updating item:", err);
          // Handle error accordingly
          res.status(500).send("Update operation failed");
      } else {
          console.log("Item updated successfully:", updatedItem);
          // Redirect or render success page
          res.send("<script>alert('Item updated successfully');  window.location.href = '" + parentHref + "';</script>");
      }
  });
});
app.post("/update_faculty", function(req, res) {
  const itemId = req.body.itemId; // Retrieve the item ID
  const updatedItem = {
    student_id: req.body.student_id,
    name: req.body.name,
    contact_number: req.body.contact_number,
    // enrol_id: req.body.enrol_id,
    numBooksBorrowed: req.body.numBooksBorrowed
};
  const parentHref = req.body.parentHref; // Retrieve the parentHref value from the form
  console.log('post'+parentHref);
  Faculty.findByIdAndUpdate(itemId, updatedItem, { new: true }, function(err, updatedItem) {
      if (err) {
          console.log("Error updating item:", err);
          // Handle error accordingly
          res.status(500).send("Update operation failed");
      } else {
          console.log("Item updated successfully:", updatedItem);
          // Redirect or render success page
          res.send("<script>alert('Faculty details updated successfully');  window.location.href = '/';</script>");
      }
  });
});
app.get("/update", function (req, res) {
    const itemId = req.query.itemId; // Extract itemId from query parameters
    const parentHref = req.query.parentHref;
    console.log('get'+parentHref);

    Item.findById(itemId, function (err, item) {
    if (err) {
        console.error("Error finding item:", err);
        return res.status(500).send("Error finding item");
    }

    if (!item) {
        console.log("Item not found");
        return res.status(404).send("Item not found");
    }

    // Find all subjects
    Subject.find({}, function(err, foundItems) {
        if (err) {
            console.error("Error finding subjects:", err);
            return res.status(500).send("Error finding subjects");
        }
        foundItems = sortArrayByProperty(foundItems, 'name');
        // Render the update view with the item details and subject items
        res.render('update', {
            item: item,
            parentHref: parentHref,
            booksCount: book_index,
            subjectItems: foundItems
        });
    });
});

    // Find the item in the database by its itemId
    // Item.findById(itemId, function (err, item) {
    //     if (err) {
    //         console.log("Error finding item:", err);
    //         // Handle the error appropriately, such as rendering an error page
    //         return res.status(500).send("Error finding item");
    //     }
    //
    //     if (!item) {
    //         // If the item with the given itemId is not found, handle it
    //         console.log("Item not found");
    //         // Render a not found page or redirect to an appropriate URL
    //         return res.status(404).send("Item not found");
    //     }
    //     // Subject.find({}, function(err, foundItems) {
    //     //   if (err) {
    //     //     console.error("Error finding subjects:", err);
    //     //     // Handle the error appropriately, such as rendering an error page
    //     //     return res.status(500).send("Error finding subjects");
    //     //   }
    //     //   res.render('update', { item: item, parentHref: parentHref, booksCount: book_index,subjectItems: foundItems });
    //     // });
    //
    //     // If the item is found, render the update view with the item details
    //     res.render("update", { item: item, parentHref: parentHref});
    // });
});
app.get("/update_student", function (req, res) {
    const itemId = req.query.itemId; // Extract itemId from query parameters
    const parentHref = req.query.parentHref;
    console.log('get'+parentHref);
    // Find the item in the database by its itemId
    Student.findById(itemId, function (err, item) {
        if (err) {
            console.log("Error finding item:", err);
            // Handle the error appropriately, such as rendering an error page
            return res.status(500).send("Error finding item");
        }

        if (!item) {
            // If the item with the given itemId is not found, handle it
            console.log("Item not found");
            // Render a not found page or redirect to an appropriate URL
            return res.status(404).send("Item not found");
        }

        // If the item is found, render the update view with the item details
        res.render("update_student", { item: item, parentHref: parentHref});
    });
});
app.get("/update_faculty", function (req, res) {
    const itemId = req.query.itemId; // Extract itemId from query parameters
    const parentHref = req.query.parentHref;
    console.log('get'+parentHref);
    // Find the item in the database by its itemId
    Faculty.findById(itemId, function (err, item) {
        if (err) {
            console.log("Error finding item:", err);
            // Handle the error appropriately, such as rendering an error page
            return res.status(500).send("Error finding item");
        }

        if (!item) {
            // If the item with the given itemId is not found, handle it
            console.log("Item not found");
            // Render a not found page or redirect to an appropriate URL
            return res.status(404).send("Item not found");
        }

        // If the item is found, render the update view with the item details
        res.render("update_faculty", { item: item, parentHref: parentHref});
    });
});
app.post("/issue", function (req, res) {

    const itemId = req.body.itemId;
    const parentHref = req.body.parentHref;

    Item.findById(itemId, function (err, item) {
        if (err) {
            console.log("Error finding item:", err);
            // Handle the error appropriately, such as rendering an error page
            return res.status(500).send("Error finding item");
        }

        if (!item) {
            // If the item with the given itemId is not found, handle it
            console.log("Item not found");
            // Render a not found page or redirect to an appropriate URL
            return res.status(404).send("Item not found");
        }
        console.log(item.serial_number);
        // If the item is found, render the update view with the item details
        res.render("issue", { item: item, parentHref: parentHref});
    });

});
app.post("/issue_book_by_faculty", function (req, res) {

    const itemId = req.body.itemId;
    const parentHref = req.body.parentHref;

    Item.findById(itemId, function (err, item) {
        if (err) {
            console.log("Error finding item:", err);
            // Handle the error appropriately, such as rendering an error page
            return res.status(500).send("Error finding item");
        }

        if (!item) {
            // If the item with the given itemId is not found, handle it
            console.log("Item not found");
            // Render a not found page or redirect to an appropriate URL
            return res.status(404).send("Item not found");
        }
        console.log(item.serial_number);
        // If the item is found, render the update view with the item details
        res.render("issue_book_faculty", { item: item, parentHref: parentHref});
    });

});
app.post("/viewdetails", function (req, res) {

    const itemId = req.body.itemId;
    const parentHref = req.body.parentHref;

    Item.findById(itemId, function (err, item) {
        if (err) {
            console.log("Error finding item:", err);
            // Handle the error appropriately, such as rendering an error page
            return res.status(500).send("Error finding item");
        }

        if (!item) {
            // If the item with the given itemId is not found, handle it
            console.log("Item not found");
            // Render a not found page or redirect to an appropriate URL
            return res.status(404).send("Item not found");
        }
        console.log(item.serial_number);
        // If the item is found, render the update view with the item details
        res.render("about", { item: item, parentHref: parentHref});
    });

});
app.post("/goback",function(req,res){
  const parentHref = req.body.parentHref;
  res.send("<script>  window.location.href = '" + parentHref + "';</script>");
});
app.get("/insert", function (req, res) {
    Item.countDocuments({}, function(err, count) {
        if (err) {
            console.log("Error occurred while counting documents:", err);
            res.status(500).send("Error occurred while counting documents");
        } else {
            console.log("Total number of documents:", count);
            let book_index = 1;
            if (count > 0) {
                Item.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, lastItem) {
                    if (err) {
                        console.log("Error finding last item:", err);
                        res.status(500).send("Error finding last item");
                    } else {
                        console.log("Last inserted item:", lastItem);
                        book_index = parseInt(lastItem.serial_number) + 1;
                        console.log("Book index set to:", book_index);
                        renderInsertPage(book_index, res);
                    }
                });
            } else {
                renderInsertPage(book_index, res);
            }
        }
    });
});

function renderInsertPage(book_index, res) {
  Subject.find({}, function(err, foundItems) {
    if (err) {
      console.error("Error finding subjects:", err);
      // Handle the error appropriately, such as rendering an error page
      return res.status(500).send("Error finding subjects");
    }
    foundItems = sortArrayByProperty(foundItems, 'name');
    res.render('insert', { booksCount: book_index,subjectItems: foundItems });
  });

}
app.post("/insert", function (req, res) {
  const authorCount = parseInt(req.body.author_count);

  // Initialize an array to store author names
  const authorNames = [];

  // Loop through the form data to extract author names
  for (let i = 1; i <= authorCount; i++) {
      const authorName = req.body[`author_name${i}`];
      authorNames.push(authorName);
  }

  // Do whatever you need to do with the extracted author names
  console.log("Author Names:", authorNames);
  var sn;
//   getBooksCountFromDataSource(function(err, count) {
//     if (err) {
//         // res.render('insert', { fruitsCount: count });
//         console.log(err);// Handle error
//     } else {
//         // 'count' contains the total number of fruits
//         //res.render('insert', { booksCount: (count+1) });
//         // Pass 'count' to your rendering function or wherever you need to use it
//         sn = count + 1;
//     }
// });
    //const serial_number = req.body.serial_number;
    const serialNumber = req.body.sn;
    // Use the serial number as needed
    console.log("Serial Number:", serialNumber);

    const title = req.body.title;
    const subject = req.body.subject;
    const isbn = req.body.isbn;
    const publication = req.body.publication;


    console.log(serialNumber);
    console.log(title);
    console.log(subject);
    console.log(isbn);
    console.log(publication);


    const item = new Item({
      serial_number: serialNumber,
      title: title,
      author: authorNames,
      publication: publication,
      subject: subject,
      isbn: isbn,
      status: '0',
      date: 'nan',
      history_card: '',
    });

    item.save(function(err) {
        if (!err) {
            console.log("successfully inserted");
            // book_index = book_index + 1;
            // Send a pop-up alert for successful insertion
            res.send("<script>alert('Insert Successful'); window.location.href = '/';</script>");
        } else {
            console.log(err);
            console.log("Insert operation failed");
            // Handle error accordingly
            res.status(500).send("Insert operation failed");
        }
    });
});

//
// app.post("/search" , function(req,res)
// {
//     console.log("Search------");
//     const firstnameSearch = req.body.firstnameSearch;
//
//     console.log(firstnameSearch);
//     const regex = new RegExp(firstnameSearch, 'i'); // i for case insensitive
//
//     Item.find({fruitname: {$regex: regex} } , function(err, searchDocs){
//             if(err){
//                 console.log(err);
//             }
//             else{
//                 console.log("inside else");
//                 console.log("inside else");
//
//                 console.log(searchDocs);
//
//                 res.render("search", { listTitle : "Search display", searchListItems : searchDocs });
//             }
//         });
//
//
//
//     console.log("Search End");
const fuzzy = require('fuzzy');
app.get('/search_author',function(req,res){
  Item.find({}, function(err, items) {
    if (err) {
      console.error("Error finding items:", err);
      // Handle the error appropriately, such as rendering an error page
      res.status(500).send("Error finding items");
    } else {
      // Process the found items
      // Now, perform the search based on the found items
      const searchTerm = req.query.searchValue;
      const searchResults = items.filter(item => {
        // Perform fuzzy search on each author
        const results = item.author.map(author => {
          return fuzzy.test(searchTerm, author);
        });

        // Return true if any author matches the search term
        return results.includes(true);
      });

      // Render the search results page with the list of matching authors
      res.render("search_author", { listTitle: "Search display", newListItems: searchResults });
    }
  });
});

app.get("/search_publication", function(req, res) {
    const publicationSearch = req.query.searchValue;

    console.log(publicationSearch);

    // Create an array of publication names from the database
    Item.find({}, 'publication', function(err, publications) {
        if (err) {
            console.log(err);
            res.status(500).send("Error occurred while retrieving publications for search.");
            return;
        }

        // Extract publication names from the query result
        const publicationNames = publications.map(pub => pub.publication);

        // Perform fuzzy search on publication names
        const results = fuzzy.filter(publicationSearch, publicationNames);
        const fuzzyResults = results.map(result => result.string);

        console.log("Fuzzy search results:");
        console.log(fuzzyResults);

        // Find documents where publication name matches any of the fuzzy search results
        Item.find({ publication: { $in: fuzzyResults } }, function(err, searchDocs) {
            if (err) {
                console.log(err);
                res.status(500).send("Error occurred while searching publications.");
            } else {
                console.log("Search results:");
                console.log(searchDocs);
                res.render("search_author", { listTitle: "Search display", newListItems: searchDocs });
            }
        });
    });
});
app.get("/search_book", function(req, res) {
    const titleSearch = req.query.searchValue;

    console.log(titleSearch);

    // Create an array of book titles from the database
    Item.find({}, function(err, items) {
        if (err) {
            console.log(err);
            res.status(500).send("Error occurred while retrieving publications for search.");
            return;
        }

        // Extract publication names from the query result
        const titleNames = items.map(item => item.title);

        // Perform fuzzy search on publication names
        const results = fuzzy.filter(titleSearch, titleNames);
        const fuzzyResults = results.map(result => result.string);

        console.log("Fuzzy search results:");
        console.log(fuzzyResults);

        // Find documents where book title matches any of the fuzzy search results
        Item.find({ title: { $in: fuzzyResults } }, function(err, searchDocs) {
            if (err) {
                console.log(err);
                res.status(500).send("Error occurred while searching publications.");
            } else {
                res.render("search_author", { listTitle: "Search display", newListItems: searchDocs });
            }
        });
    });
});
app.get("/search_serial", function(req, res) {
    const serialNumber = req.query.searchValue; // Access the search value from req.query

    // Create a regular expression for case-insensitive matching
    const regex = new RegExp(serialNumber, 'i');

    // Find documents where the serial_number field matches the regular expression
    Item.find({ serial_number: { $regex: regex } }, function(err, searchResults) {
        if (err) {
            console.error(err);
            // Handle the error appropriately, such as rendering an error page
            return res.status(500).send("Error finding serial numbers");
        }

        // Render the search results page with the list of matching serial numbers
        res.render("search_author", { listTitle: "Search display", newListItems: searchResults });
    });
});
app.get("/search_isbn", function(req, res) {
    console.log("Search ISBN");
    const isbnSearch = req.query.searchValue; // Use req.query for GET requests
    console.log(isbnSearch);

    // Create a regular expression to find ISBNs that match or contain the search term
    const regex = new RegExp(isbnSearch, 'i'); // 'i' for case-insensitive matching

    // Use the regular expression to find ISBNs that match or contain the search term
    Item.find({ isbn: { $regex: regex } }, function(err, searchResults) {
        if (err) {
            console.error(err);
            // Handle the error appropriately, such as rendering an error page
            return res.status(500).send("Error finding ISBNs");
        }

        console.log("Search results:", searchResults);

        // Render the search results page with the list of matching ISBNs
        res.render("search_author", { listTitle: "Search display", newListItems: searchResults });
    });
});
app.get("/find", function(req, res) {
  // Find all categories and subjects from the database concurrently
  Promise.all([Category.find({}), Subject.find({})])
    .then(([foundCategories, foundSubjects]) => {

      foundCategories = sortArrayByProperty(foundCategories,'name');
      foundSubjects = sortArrayByProperty(foundSubjects,'name');
      // Render the "find" view with the retrieved category and subject items
      res.render("find", { categoryItems: foundCategories, subjectItems: foundSubjects });
      //res.render("records", { categoryItems: foundCategories, newListItems: foundSubjects });

    })
    .catch(err => {
      console.error("Error finding categories and subjects:", err);
      // Handle the error appropriately, such as rendering an error page
      res.status(500).send("Error finding categories and subjects");
    });
});
app.get('/find_students',function(req, res){
  res.render("find_student",{});
});
app.get('/find_faculty',function(req, res){
  res.render("find_faculty",{});
});
app.get('/search_student_by_id',function(req, res){
  const student_id = req.query.searchValue; // Access the search value from req.query

  // Create a regular expression for case-insensitive matching
  const regex = new RegExp(student_id, 'i');

  // Find documents where the serial_number field matches the regular expression
  Student.find({ student_id: { $regex: regex } }, function(err, searchResults) {
      if (err) {
          console.error(err);
          // Handle the error appropriately, such as rendering an error page
          return res.status(500).send("Error finding serial numbers");
      }

      // Render the search results page with the list of matching serial numbers
      res.render("search_student", { listTitle: "Search display", newListItems: searchResults });
  });
});
app.get('/search_student_by_name',function(req, res){
  const student_name_to_be_searched = req.query.searchValue;

    // Construct a regular expression to perform a case-insensitive search
    var regex = new RegExp(student_name_to_be_searched, 'i');

    // Search for students whose names contain the search value
    Student.find({ name: { $regex: regex } }, function(err, searchResults) {
      if (err) {
        console.error(err);
        // Handle the error appropriately, such as rendering an error page
        return res.status(500).send("Error finding students");
      }

      // Render the search results page with the list of matching students
      res.render("search_student", { listTitle: "Search Results", newListItems: searchResults });
    });
});
app.get('/search_faculty_by_id',function(req, res){
  const student_id = req.query.searchValue; // Access the search value from req.query

  // Create a regular expression for case-insensitive matching
  const regex = new RegExp(student_id, 'i');

  // Find documents where the serial_number field matches the regular expression
  Faculty.find({ student_id: { $regex: regex } }, function(err, searchResults) {
      if (err) {
          console.error(err);
          // Handle the error appropriately, such as rendering an error page
          return res.status(500).send("Error finding serial numbers");
      }

      // Render the search results page with the list of matching serial numbers
      res.render("search_faculty", { listTitle: "Search display", newListItems: searchResults });
  });
});
app.get('/search_faculty_by_name',function(req, res){
  const student_name_to_be_searched = req.query.searchValue;

    // Construct a regular expression to perform a case-insensitive search
    var regex = new RegExp(student_name_to_be_searched, 'i');

    // Search for students whose names contain the search value
    Faculty.find({ name: { $regex: regex } }, function(err, searchResults) {
      if (err) {
        console.error(err);
        // Handle the error appropriately, such as rendering an error page
        return res.status(500).send("Error finding students");
      }

      // Render the search results page with the list of matching students
      res.render("search_faculty", { listTitle: "Search Results", newListItems: searchResults });
    });
});
app.get('/search_student_by_enrol_id',function(req, res){
  const student_enrolId_to_be_searched = req.query.searchValue;

    // Construct a regular expression to perform a case-insensitive search
    var regex = new RegExp(student_enrolId_to_be_searched, 'i');

    // Search for students whose names contain the search value
    Student.find({ enrol_id: { $regex: regex } }, function(err, searchResults) {
      if (err) {
        console.error(err);
        // Handle the error appropriately, such as rendering an error page
        return res.status(500).send("Error finding students");
      }

      // Render the search results page with the list of matching students
      res.render("search_student", { listTitle: "Search Results", newListItems: searchResults });
    });
});
app.get("/view_subjects", function(req, res) {
  // Subject.find({}, function(err, foundItems) {
  //   if (err) {
  //     console.error("Error finding subjects:", err);
  //     // Handle the error appropriately, such as rendering an error page
  //     return res.status(500).send("Error finding subjects");
  //   }
  //   // If categories are found, render the "find" view with the category items
  //   res.render("view_subjects", { newListItems: foundItems });
  // });
  Subject.find({}).sort({ name: 1 }).exec(function(err, foundItems) {
  if (err) {
    console.error("Error finding subjects:", err);
    // Handle the error appropriately, such as rendering an error page
    return res.status(500).send("Error finding subjects");
  }
  // If categories are found, render the "find" view with the category items
  res.render("view_subjects", { newListItems: foundItems });
});
});
app.get("/view_categories", function(req, res) {
  // Category.find({}, function(err, foundItems) {
  //   if (err) {
  //     console.error("Error finding categories:", err);
  //     // Handle the error appropriately, such as rendering an error page
  //     return res.status(500).send("Error finding categories");
  //   }
  //   // If categories are found, render the "find" view with the category items
  //   res.render("view_categories", { newListItems: foundItems });
  // });
  Category.find({}).sort({ name: 1 }).exec(function(err, foundItems) {
  if (err) {
    console.error("Error finding categories:", err);
    // Handle the error appropriately, such as rendering an error page
    return res.status(500).send("Error finding categories");
  }
  // If categories are found, render the "find" view with the category items
  res.render("view_categories", { newListItems: foundItems });
});
});
// Route handler to check if student is registered
app.post('/check_student_registration', (req, res) => {
  // Extract the student ID number from the request body
  const studentId = req.body.student_id;
  console.log(studentId);
  // Query the database for a student with the provided ID number
  Student.findOne({ student_id: studentId }, (err, student) => {
    console.log('here');
    if (err) {
      // Handle database error
      console.error('Error querying database:', err);
      res.status(500).json({ success: false, message: 'An error occurred while checking student registration.' });
    } else {
      if (student) {
        // Student found in the database, indicate that the student is registered
        res.json({ success: true,registered: true,student: student, message: 'Student is registered.' });
        console.log("success: true,registered:true, message: 'Student is registered.'");
        console.log("Student found: ",student);
      } else {
        // No student found with the provided ID number, indicate that the student is not registered
        res.json({ success: true,registered: false, message: 'Student is not registered.' });
        console.log("{ success: true,registered: false,  message: 'Student is not registered.' }");
      }
    }
  });
});


app.post('/register_student',function(req,res){
  const student_id = req.body.student_id;
  const name = req.body.name;
  const enrol_id = req.body.enrol_id;
  const contact_num = req.body.contact_number;
  const num_books = 0;
  console.log(student_id + name + enrol_id + num_books);
  const student = new Student({
    student_id: student_id,
    name: name,
    enrol_id: enrol_id,
    contact_number: contact_num,
    numBooksBorrowed: String(num_books)
  });

  student.save(function(err) {
      if (!err) {
          console.log("successfully inserted");
          // book_index = book_index + 1;
          // Send a pop-up alert for successful insertion
          res.send("<script>alert('Insert Successful'); window.location.href = '/';</script>");
      } else {
          console.log(err);
          console.log("Insert operation failed");
          // Handle error accordingly
          res.status(500).send("Insert operation failed");
      }
  });
});

app.get('/insert_student',function(req,res){
  res.render("insert_student",{});
});

app.get('/view_student',function(req,res){
  Student.find({}, function (err, foundItems) {

          res.render("view_student", { newListItems: foundItems });

  });
});

app.post('/view_issued_student', function(req, res) {
  const studentId = req.body.studentId;
  const parentHref = req.body.parentHref;
  console.log(studentId + parentHref);
Student.findById(studentId, function(err, student) {
  if (err) {
      console.log("Error finding student:", err);
      return res.status(500).send("Error finding student");
  }

  if (!student) {
      console.log("Student not found");
      return res.status(404).send("Student not found");
  }

  const books = [];
  let counter = 0;

  // Retrieve book details for each bookId in student's bookIds array
  student.bookIds.forEach(function(bookId) {
      Item.findById(bookId, function(err, book) {
          if (err) {
              console.log("Error finding book:", err);
              return res.status(500).send("Error finding book");
          }

          if (!book) {
              console.log("Book not found");
              // You might want to handle the case where a book is not found
              // For now, just log it and continue
              counter++;
              if (counter === student.bookIds.length) {
                  // If all books have been processed, render the template
                  res.render("view_issued_student", { newListItems: books, student: student, parentHref: parentHref });
              }
              return;
          }

          // If the book is found, add it to the books array
          books.push(book);

          // Check if all books have been processed
          counter++;
          if (counter === student.bookIds.length) {
              // If all books have been processed, render the template
              res.render("view_issued_student", { newListItems: books, student: student});
          }
      });
  });
});
});


app.post('/issue_book', async function(req, res) {
  const sid = req.body.sid;
  const bid = req.body.bid;
  console.log("sid = " + sid + " bid = " + bid);

  try {
    const student = await Student.findById(sid);
    if (!student) {
      console.log("Student not found");
      return res.status(404).send("Student not found");
    }

    student.bookIds.push(bid);
    // if(parseInt(student.numBooksBorrowed) == 6)
    // {
    //   return res.status(404).send()
    // }
    student.numBooksBorrowed = String(parseInt(student.numBooksBorrowed) + 1);

    studentId = student.student_id;
    studentName = student.name;
    studentEnrolmentId = student.enrol_id;
    await student.save();
    console.log("Student: ", student);

    const book = await Item.findById(bid);
    if (!book) {
      console.log("Book not found");
      return res.status(404).send("Book not found");
    }

    book.status = '1';
    const date = new Date();
    book.date = String(date);
    const clean_date = String(date.getDate()) +'/' +String(date.getMonth() + 1)+'/'+ String(date.getFullYear());
    book.history_card = book.history_card + 'hi '+ '\t' +studentId +'\t' + studentName +'\t'+ studentEnrolmentId +'\t'+ clean_date+'\t'+'';
    await book.save();
    console.log("Book: ", book);

    res.render('issue_book', {});
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).send("Error processing request");
  }
});

app.post('/return_book', async function(req, res) {
  const sid = req.body.sid;
  const bid = req.body.bid;
  console.log("sid = " + sid + " bid = " + bid);

  try {
    const student = await Student.findById(sid);
    if (!student) {
      console.log("Student not found");
      return res.status(404).send("Student not found");
    }

    student.bookIds = student.bookIds.filter(bookId => bookId !== bid);
    student.numBooksBorrowed = String((student.bookIds.length));
    await student.save();
    console.log("Student: ", student);

    const book = await Item.findById(bid);
    if (!book) {
      console.log("Book not found");
      return res.status(404).send("Book not found");
    }

    book.status = '0';
    const date = new Date();
    const clean_date = String(date.getDate()) +'/' +String(date.getMonth() + 1)+'/'+ String(date.getFullYear());
    book.history_card = book.history_card + clean_date;
    await book.save();
    console.log("Book: ", book);

    res.render('return_book', {});
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).send("Error processing request");
  }
});

app.get('/student_issued',function(req, res){
  Student.find({ numBooksBorrowed: { $gt: 0 } }, (err, students) => {
  if (err) {
    console.error('Error finding students:', err);
    // Handle the error appropriately
  } else {
    console.log('Students with numBooksBorrowed > 0:', students);
    // Now you have an array of students with numBooksBorrowed > 0
    // You can further process or use this array as needed
    res.render('student_issued',{newListItems: students});
  }
});
});

app.get('/student_issued_report',function(req, res){
//   Student.find({ numBooksBorrowed: { $gt: 0 } }, (err, students) => {
//   if (err) {
//     console.error('Error finding students:', err);
//     // Handle the error appropriately
//   } else {
//     const currentDate = new Date();
//     console.log('Students with numBooksBorrowed > 0:', students);
//
//     // Now you have an array of students with numBooksBorrowed > 0
//     // You can further process or use this array as needed
//     res.render('student_issued_report',{currentDate: currentDate, newListItems: students});
//   }
// });
//
// Student.find({ numBooksBorrowed: { $gt: 0 } }, (err, students) => {
//   if (err) {
//     console.error('Error finding students:', err);
//     // Handle the error appropriately
//   } else {
//     const currentDate = new Date();
//     console.log('Students with numBooksBorrowed > 0:', students);
//
//     // Initialize an array to hold book details for each student
//     const bookDetailsByStudent = [];
//
//     students.forEach(student => {
//       // For each student, initialize an array to hold their borrowed books
//       const studentBookDetails = [];
//
//       // Iterate through each book ID the student has borrowed
//       student.bookIds.forEach(async bookId => {
//         try {
//           // Fetch the book details from the database using the book ID
//           const book = await Item.findById(bookId);
//           if (book) {
//             console.log(book);
//             studentBookDetails.push(book);
//             console.warn(`Book found with ID ${bookId}`);
//           } else {
//             console.warn(`Book not found with ID ${bookId}`);
//           }
//         } catch (error) {
//           console.error(`Error fetching book details with ID ${bookId}:`, error);
//           // Handle the error appropriately
//         }
//       });
//
//       // Push the array of book details for this student to the main array
//       bookDetailsByStudent.push(studentBookDetails);
//     });
//
//     // Now you have an array of objects, each containing a student's name and an array of their borrowed books
//     console.log('Book details by student:', bookDetailsByStudent);
//
//     // Render the report with the current date and the list of students with their borrowed books
//     res.render('student_issued_report', { currentDate: currentDate, newListItems: students, books: bookDetailsByStudent});
//   }
// });
Student.find({ numBooksBorrowed: { $gt: 0 } }, async (err, students) => {
  if (err) {
    console.error('Error finding students:', err);
    // Handle the error appropriately
    return;
  }

  try {
    const currentDate = new Date();
    console.log('Students with numBooksBorrowed > 0:', students);

    // Initialize an array to hold promises for fetching book details for each student
    const promises = students.map(async student => {
      // Fetch the book details for each student in parallel
      const studentBookDetails = await Promise.all(student.bookIds.map(async bookId => {
        try {
          // Fetch the book details from the database using the book ID
          const book = await Item.findById(bookId);
          if (book) {
            console.log(book);
            return book;
          } else {
            console.warn(`Book not found with ID ${bookId}`);
            return null; // or throw an error if needed
          }
        } catch (error) {
          console.error(`Error fetching book details with ID ${bookId}:`, error);
          // Handle the error appropriately
          return null;
        }
      }));

      // Filter out null values (books not found)
      return studentBookDetails.filter(book => book !== null);
    });

    // Wait for all promises to resolve
    const bookDetailsByStudent = await Promise.all(promises);

    // Now you have an array of arrays, each containing a student's borrowed books
    console.log('Book details by student:', bookDetailsByStudent);

    // Render the report with the current date and the list of students with their borrowed books
    res.render('student_issued_report', { currentDate: currentDate, newListItems: students, books: bookDetailsByStudent });
  } catch (error) {
    console.error('Error:', error);
    // Handle the error appropriately
  }
});
});

app.get('/student_clearance_check',function(req, res){
  res.render('student_clearance_checking',{});
});

const fs = require('fs');

app.get('/backup', async (req, res) => {
    try {
        // Ensure that the directory for saving CSV files exists
        const directory = 'backup';
        if (!fs.existsSync(directory)) {
          fs.mkdir('backup', { recursive: true, mode: 0o700 }, (err) => {
            if (err) throw err;
            console.log('Directory created with permissions');
          });
        }

        // Retrieve data from MongoDB
        const items = await Item.find();

        // Define header row
        const headerRow = '"serial_number","title","author","publication","subject","isbn","status"';

        // Convert data to CSV format
        const csvData = items.map(item => {
            return `"${item.serial_number}","${item.title}","${item.author}","${item.publication}","${item.subject}","${item.isbn}","${item.status}"`; // Add other fields as needed
        }).join('\n');

        // Concatenate header row and CSV data
        const fullCsvData = `${headerRow}\n${csvData}`;
        // Get the current date and time
        const currentDate = new Date().toISOString();

        // Remove non-alphabetic characters and replace them with underscores
        const sanitizedDate = currentDate.replace(/[^a-zA-Z0-9]/g, '_');

        // Construct the file path
        const filePath = `book_${sanitizedDate}.csv`;

        // Generate file name with prefix "book" and current date/time
        const fileName = filePath;
        const fullFilePath = `${directory}/${fileName}`;
        //const fullFilePath = `backup/1.csv`;
        // Write data to CSV file
        // Create the file if it doesn't exist
fs.open(fullFilePath, 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('File already exists');
      // return;
    }
    else {
      throw err;
    }
  }

  // Write the CSV data to the file
  fs.writeFile(fd, fullCsvData, (err) => {
    if (err) throw err;
    console.log(`File "${fullFilePath}" created and data written successfully.`);
    fs.close(fd, (err) => {
      if (err) throw err;
      console.log('File closed successfully.');
    });
  });
});
        res.send(`Backup completed successfully! File name: ${fileName}`);
    } catch (error) {
        console.error('Error backing up data:', error);
        res.status(500).send('An error occurred during backup.');
    }
    // Create directory with read, write, and execute permissions for the owner

});
// Route to retrieve student data from MongoDB and save it to JSON file
app.get('/store_students_data', async (req, res) => {
  try {
    // Find all documents in the "Student" collection
    const students = await Student.find({});

    // Convert student data to JSON format
    const jsonData = JSON.stringify(students, null, 2);

    // Write JSON data to a file
    fs.writeFile('studentData.json', jsonData, (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
        res.status(500).send('Error occurred while saving student data.');
        return;
      }
      console.log('JSON file containing student data saved successfully');
      res.send('Student data stored successfully');
    });
  } catch (error) {
    console.error('Error finding students:', error);
    res.status(500).send('Error occurred while retrieving student data.');
  }
});


app.get('/items',function(req,res){
  // Read and parse CSV file
const filePath = 'excel/book_list_2023.csv';
const items = [];

fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
        // Push data from each row into the items array
        if (row.author.includes(',')) {
            row.author = row.author.split(',').map(author => author.trim());
        }
        items.push(row);
    })
    .on('end', () => {
        // Insert items into the database
        Item.insertMany(items, (err, docs) => {
            if (err) {
                console.error('Error inserting items:', err);
            } else {
                console.log('Items inserted successfully:', docs);
                res.send('Items inserted successfully:');
            }
          });
        });
});

app.get('/store_categories1', function(req, res) {
    const filePath = 'excel/sample1/categories.csv';
    const categories = [];

    // Read the CSV file and parse its contents
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          const categoryName = row.category_name.trim();
            let subjects = row.subjects.trim();

            // Convert subjects to an array of strings
            if (subjects.includes(',')) {
                subjects = subjects.split(',').map(subject => subject.trim());
            } else {
                // If subjects is not a comma-separated string, convert it to an array with a single element
                subjects = [subjects];
            }

            // Create an object representing the category with its name and subjects
            const category = {
                name: categoryName,
                subjects: subjects
            };

            categories.push(category);
        })
        .on('end', () => {
          console.log(categories);
            // Insert categories into the database
            Category.insertMany(categories, (err, docs) => {
                if (err) {
                    console.error('Error inserting categories:', err);
                    res.status(500).send('Error inserting categories');
                } else {
                    console.log('Categories inserted successfully:', docs);
                    res.send('Categories inserted successfully');
                }
            });
        });
});

app.get('/store_subjects1', function(req, res) {
    const filePath = 'excel/sample1/subjects.csv';
    const subjects = [];

    // Read the CSV file and parse its contents
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          const subjectName = row.name.trim();

            // Create an object representing the category with its name and subjects
            const subject = {
                name: subjectName
            };

            subjects.push(subject);
        })
        .on('end', () => {
          console.log(subjects);
            // Insert categories into the database
            Subject.insertMany(subjects, (err, docs) => {
                if (err) {
                    console.error('Error inserting categories:', err);
                    res.status(500).send('Error inserting categories');
                } else {
                    console.log('Subjects inserted successfully:', docs);
                    res.send('Subjects inserted successfully');
                }
            });
        });
});

app.get('/delete_all',function(req,res){
    Item.deleteMany({}, function(err) {
    if (err) {
      console.error("Error deleting items:", err);
    } else {
      console.log("All items deleted successfully.");
      res.send("All items deleted successfully.");
    }
  });
});
app.get('/delete_all_students',function(req,res){
    Student.deleteMany({}, function(err) {
    if (err) {
      console.error("Error deleting items:", err);
    } else {
      console.log("All student items deleted successfully.");
      res.send("All student items deleted successfully.");
    }
  });
});

app.get('/categories',function(req,res){
  Item.find({}, function (err, items) {

          //res.render("view_student", { newListItems: foundItems });

          // Define a Set to store unique subjects
          const uniqueSubjects = new Set();

          // Iterate through the items
          items.forEach(item => {
              // Trim and convert the subject to uppercase
              const subject = item.subject.trim().toUpperCase();

              // Log the trimmed and uppercase subject if it's not already logged
              if (!uniqueSubjects.has(subject)) {
                  console.log(subject);
                  uniqueSubjects.add(subject); // Add the subject to the Set
              }
          });

          // Log the count of unique subjects
          console.log("Number of unique subjects:", uniqueSubjects.size);
            });
  // Assuming items is an array containing your items with a property 'subject'

// Define an object to store the count of each subject

  res.render('categories',{});
});

app.get("/search_category",function(req,res){
  const categoryId = req.query.categoryId;
  console.log(categoryId);
  const parentHref = req.query.parentHref;
  console.log(parentHref);
  Category.findById(categoryId, function (err, item) {
      if (err) {
          console.log("Error finding item:", err);
          // Handle the error appropriately, such as rendering an error page
          return res.status(500).send("Error finding item");
      }

      if (!item) {
          // If the item with the given itemId is not found, handle it
          console.log("Item not found");
          // Render a not found page or redirect to an appropriate URL
          return res.status(404).send("Item not found");
      }

      subjects = item.subjects;
      var books = [];

      // Iterate over each subject
      subjects.forEach(subject => {
        // Trim the subject
        const trimmedSubject = subject.trim();

        // Find books that have the trimmed subject
        Item.find({ subject: trimmedSubject })
          .then(foundBooks => {
            // Add found books to the 'books' array
            books.push(...foundBooks);

            // Check if this is the last subject
            if (subjects.indexOf(subject) === subjects.length - 1) {
              // This is the last subject, do something with the 'books' array
              //console.log("Books matching subjects:", books);
              console.log("Books matching subjects:", books);
              // If the item is found, render the update view with the item details
              res.render("search_category", { parentHref: parentHref, newListItems: books});
            }
          })
          .catch(error => {
            console.error("Error finding books:", error);
              });
          });

  });
});

app.get("/search_subject", function(req, res) {
  const subjectId = req.query.subjectId;
  const parentHref = req.query.parentHref;

  Subject.findById(subjectId, function(err, subject) {
    if (err) {
      console.error("Error finding subject:", err);
      return res.status(500).send("Error finding subject");
    }

    if (!subject) {
      console.log("Subject not found");
      return res.status(404).send("Subject not found");
    }

    const trimmedSubject = subject.name.trim();
    console.log(trimmedSubject);
    Item.find({ subject: trimmedSubject })
      .then(foundBooks => {
        res.render("search_subject", { item: subject, parentHref: parentHref, newListItems: foundBooks });
    })
      .catch(error => {
        console.error("Error finding books:", error);
        res.status(500).send("Error finding books");
      });
  });
});

app.get("/insert_category",function(req,res){
  // Subject.find({},function(err, foundItems){
  //   if(err){
  //     console.error("Error finding subjects: ",err);
  //     return res.status(500).send("Error finding subjects");
  //   }
  //   res.render("category_insert",{subjectItems: foundItems});
  // });
  Subject.find({}).sort({ name: 1 }).exec(function(err, foundItems) {
  if (err) {
    console.error("Error finding subjects:", err);
    // Handle the error appropriately, such as rendering an error page
    return res.status(500).send("Error finding subjects");
  }
  // If categories are found, render the "find" view with the category items
  res.render("category_insert", { subjectItems: foundItems });
  });
});
app.post('/insert_category', (req, res) => {
  const { name, selectedSubjects } = req.body;

  console.log(name);
  const filteredSubjects = selectedSubjects.filter(item => item.trim() !== '');

console.log(filteredSubjects);

  // Create a new category object
  const newCategory = new Category({
    name: name,
    subjects: filteredSubjects
  });

  // Save the new category to the database
  newCategory.save()
    .then(savedCategory => {
      console.log('Category saved successfully:', savedCategory);
      res.redirect('/'); // Redirect to the homepage or any other page as needed
    })
    .catch(err => {
      console.error('Error saving category:', err);
      res.status(500).send('Error saving category');
    });
});

app.get("/insert_subject",function(req,res){
  // Category.find({},function(err, foundItems){
  //   if(err){
  //     console.error("Error finding subjects: ",err);
  //     return res.status(500).send("Error finding subjects");
  //   }
  //   res.render("subject_insert",{subjectItems: foundItems});
  // });
  Category.find({}).sort({ name: 1 }).exec(function(err, foundItems) {
  if (err) {
    console.error("Error finding categories:", err);
    // Handle the error appropriately, such as rendering an error page
    return res.status(500).send("Error finding categories");
  }
  // If categories are found, render the "find" view with the category items
  res.render("subject_insert", { subjectItems: foundItems });
});
});
app.post('/insert_subject', (req, res) => {
  const { name, selectedCategories} = req.body;

  console.log(name);
  const filteredCategoriesId = selectedCategories.filter(item => item.trim() !== '');

  console.log(filteredCategoriesId);

  // Create a new category object
  const newSubject = new Subject({
    name: name
    // subjects: filteredSubjects
  });

  newSubject.save()
  .then(savedSubject => {
    console.log('Subject saved successfully:', savedSubject);


    // Iterate over the filtered categories IDs
    filteredCategoriesId.forEach(function(category_id) {
      // Find the category by ID and update its subjects array
      Category.findById(category_id)
        .then(category => {
          if (category) {
            // Append the newly added subject to the category's subjects array
            category.subjects.push(savedSubject.name);

            // Save the updated category
            return category.save();
          } else {
            console.error('Category not found');
            // Handle the case where the category is not found
            return Promise.reject(new Error('Category not found'));
          }
        })
        .then(updatedCategory => {
          console.log('Category updated successfully:', updatedCategory);
        })
        .catch(err => {
          console.error('Error updating category:', err);
        });
    });
    res.send("<script>alert('Insert Successful'); window.location.href = '/';</script>");
    // Redirect to the homepage or any other page as needed
  })
  .catch(err => {
    console.error('Error saving subject:', err);
    res.status(500).send('Error saving subject');
  });
});



app.post("/delete_subject", function (req, res) {
    const checkeditem = req.body.itemId;
    console.log("id is" + checkeditem);
    const parentHref = req.body.parentHref; // Access parent_href from request body
    console.log(String(parentHref));
    Subject.findByIdAndRemove(checkeditem, function (err) {
        if (!err) {
            console.log("successfully deleted");
            // Send a pop-up alert for successful deletion
            res.send("<script>alert('Delete Successful'); window.location.href = '" + parentHref + "';</script>");
        } else {
            console.log(err);
            console.log("Delete operation failed");
            // Handle error accordingly
            res.status(500).send("Delete operation failed");
        }
    });
  });

  app.post("/delete_category", function (req, res) {
      const checkeditem = req.body.itemId;
      console.log("id is" + checkeditem);
      const parentHref = req.body.parentHref; // Access parent_href from request body
      console.log(String(parentHref));
      Category.findByIdAndRemove(checkeditem, function (err) {
          if (!err) {
              console.log("successfully deleted");
              // Send a pop-up alert for successful deletion
              res.send("<script>alert('Delete Successful'); window.location.href = '" + parentHref + "';</script>");
          } else {
              console.log(err);
              console.log("Delete operation failed");
              // Handle error accordingly
              res.status(500).send("Delete operation failed");
          }
      });
    });

app.get("/update_category",function(req,res){
  const categoryId = req.query.itemId;
  const parentHref = req.query.parentHref;
  console.log(categoryId);

  Subject.find({}).sort({ name: 1 }).exec(function(err, items) {
  if (err) {
    console.error("Error finding subjects:", err);
    // Handle the error appropriately, such as rendering an error page
    return res.status(500).send("Error finding subjects");
  }

  // Subject.find({}, function(err, items) {
  // if (err) {
  //   console.error("Error finding subjects:", err);
  //   return res.status(500).send("Error finding subjects");
  // }

  const subjects = items.map(item => item.name);

  Category.findById(categoryId, function(err, category) {
    if (err) {
      console.error("Error finding category:", err);
      return res.status(500).send("Error finding category");
    }

    if (!category) {
      console.log("Category not found");
      return res.status(404).send("Category not found");
    }

    res.render("category_update", { subjects: subjects, category: category, parentHref: parentHref });
  });
});
});


app.post('/update_category', async (req, res) => {
  try {
    const { categoryId, name, selectedSubjects , parentHref} = req.body;

    // Validate inputs
    if (!name || !categoryId) {
      return res.status(400).send("Category ID and name are required.");
    }

    // Remove empty strings from selected subjects array
    const filteredSubjects = selectedSubjects.filter(item => item.trim() !== '');

    // Update category in the database
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name: name, subjects: filteredSubjects },
      { new: true } // Return the updated document
    );

    if (!updatedCategory) {
      return res.status(404).send("Category not found.");
    }

    console.log("Category updated successfully:", updatedCategory);
    res.send("<script>alert('Update Successful'); window.location.href = '/';</script>");

  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).send("Error updating category.");
  }
});



app.get("/about_author",function(req,res){
  res.render("about_author",{});
});



app.get("/about_development",function(req,res){
  res.render("about_development",{});
});

// Define the asynchronous function to retrieve categories and save them to JSON
async function getAllCategoriesAndSaveToJson() {
  try {
    // Find all documents in the "Category" collection
    const categories = await Category.find({});

    // Extract only the category names and subjects
    const categoriesData = categories.map(category => ({
      name: category.name,
      subjects: category.subjects
    }));

    // Convert data to JSON format
    const jsonData = JSON.stringify(categoriesData, null, 2);

    // Write JSON data to a file
    fs.writeFile('categoriesData.json', jsonData, (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
        return;
      }
      console.log('JSON file containing categories data saved successfully');
    });
  } catch (error) {
    console.error('Error finding categories:', error);
    throw error;
  }
}

// Express route handler to save categories to JSON
app.get("/save_categories", async function(req, res) {
  try {
    // Call the function to retrieve all categories and save them to JSON
    await getAllCategoriesAndSaveToJson();

    // Send response to the client
    res.send("<script>alert('Categories Successfully saved'); window.location.href = '/';</script>");
  } catch (error) {
    res.status(500).send('Error occurred while saving categories.');
  }
});

// Define the asynchronous function to retrieve subjects and save them to JSON
async function getAllSubjectsAndSaveToJson() {
  try {
    // Find all documents in the "Subject" collection
    const subjects = await Subject.find({});

    // Extract only the names from the subjects
    const subjectNames = subjects.map(subject => subject.name);

    // Convert names to JSON format
    const jsonData = JSON.stringify(subjectNames, null, 2);

    // Write JSON data to a file
    fs.writeFile('subjectNames.json', jsonData, (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
        return;
      }
      console.log('JSON file containing subject names saved successfully');
    });
  } catch (error) {
    console.error('Error finding subjects:', error);
    throw error;
  }
}

// Express route handler to save subjects to JSON
app.get("/save_subjects", async function(req, res) {
  try {
    // Call the function to retrieve all subjects and save them to JSON
    await getAllSubjectsAndSaveToJson();

    // Send response to the client
    res.send("<script>alert('Subjects Successfully saved'); window.location.href = '/';</script>");
  } catch (error) {
    res.status(500).send('Error occurred while saving subjects.');
  }
});
// Express route handler to delete all subjects
app.get("/delete_all_subjects", async function(req, res) {
  try {
    // Delete all documents in the "Subject" collection
    await Subject.deleteMany({});

    // Send response to the client
    res.send("<script>alert('All subjects successfully deleted'); window.location.href = '/';</script>");
  } catch (error) {
    res.status(500).send('Error occurred while deleting subjects.');
  }
});
// Express route handler to delete all subjects
app.get("/delete_all_categories", async function(req, res) {
  try {
    // Delete all documents in the "Categories" collection
    await Category.deleteMany({});

    // Send response to the client
    res.send("<script>alert('All categories got successfully deleted'); window.location.href = '/';</script>");
  } catch (error) {
    res.status(500).send('Error occurred while deleting categories.');
  }
});
// Route to store subjects with only names into JSON file
app.get("/store_subjects_data_to_file", async function(req, res) {
  try {
    // Find all subjects from the database
    const subjects = await Subject.find({});

    // Extract only the names of the subjects
    const subjectNames = subjects.map(subject => subject.name);

    // Convert subject names to JSON format
    const jsonData = JSON.stringify(subjectNames, null, 2);

    // Write JSON data to a file
    fs.writeFile('subjectData.json', jsonData, (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
        res.status(500).send('Error occurred while saving subjects.');
        return;
      }
      console.log('JSON file containing subject data saved successfully');
      res.send('Subjects data stored successfully');
    });
  } catch (error) {
    console.error('Error storing subjects:', error);
    res.status(500).send('Error occurred while storing subjects.');
  }
});
// Define the route handler for storing subjects
app.get('/store_subjects_from_names', async (req, res) => {
  try {
    // Read subjects data from JSON file
    const subjectNamesData = fs.readFileSync('subjectNames.json', 'utf8');
    const subjectNames = JSON.parse(subjectNamesData);

    // Iterate over the array of subject names and save each subject to the database
    for (const subjectName of subjectNames) {
      // Create a new Subject document
      const newSubject = new Subject({ name: subjectName });

      // Save the new Subject document to the database
      await newSubject.save();

      console.log(`Subject "${subjectName}" inserted successfully`);
    }

    // Send a response to the client
    res.send('Subjects stored successfully');
  } catch (error) {
    console.error('Error storing subjects:', error);
    res.status(500).send('Error occurred while storing subjects.');
  }
});
// Route to store subjects from JSON file
app.get("/store_subjects_data_from_file", async function(req, res) {
  try {
    // Read subjects data from JSON file
    const subjectsData = fs.readFileSync('subjectData.json', 'utf8');
    const subjects = JSON.parse(subjectsData);
    console.log(subjects);

    // Store subjects in the database
    await Subject.insertMany(subjects);

    res.send('Subjects stored successfully');
  } catch (error) {
    console.error('Error storing subjects:', error);
    res.status(500).send('Error occurred while storing subjects.');
  }
});

// Route to store categories from JSON file
app.get("/store_categories_data", async function(req, res) {
  try {
    // Read categories data from JSON file
    const categoriesData = fs.readFileSync('categoriesData.json', 'utf8');
    const categories = JSON.parse(categoriesData);

    // Store categories in the database
    await Category.insertMany(categories);

    res.send('Categories stored successfully');
  } catch (error) {
    console.error('Error storing categories:', error);
    res.status(500).send('Error occurred while storing categories.');
  }
});
// Route to backup categories and subjects data
app.get('/backup_category_and_Subject_data', async (req, res) => {
  try {
    // Backup categories data
    await backupCategories();

    // Backup subjects data
    await backupSubjects();

    res.send("<script>alert('Categories and Subjects data successfully backed up'); window.location.href = '/';</script>");
  } catch (error) {
    console.error('Error occurred during backup:', error);
    res.status(500).send('An error occurred during backup.');
  }
});

// Function to backup categories data
async function backupCategories() {
  try {
    const categories = await Category.find({});
    const jsonData = JSON.stringify(categories, null, 2);
    fs.writeFileSync('categoriesData.json', jsonData);
    console.log('Categories data backed up successfully');
  } catch (error) {
    console.error('Error backing up categories data:', error);
    throw error;
  }
}
// Route to backup students data
app.get('/backup_students_data', async (req, res) => {
  try {
    await backupStudents();

    res.send("<script>alert('Students data successfully backed up'); window.location.href = '/';</script>");
  } catch (error) {
    console.error('Error occurred during backup:', error);
    res.status(500).send('An error occurred during backup.');
  }
});

// Function to backup students data
async function backupStudents() {
  try {
    const students = await Student.find({});
    const jsonData = JSON.stringify(students, null, 2);
    fs.writeFileSync('studentsData.json', jsonData);
    console.log('Students data backed up successfully');
  } catch (error) {
    console.error('Error backing up students data:', error);
    throw error;
  }
}
// Function to backup subjects data
async function backupSubjects() {
  try {
    const subjects = await Subject.find({});
    const subjectNames = subjects.map(subject => subject.name);
    const jsonData = JSON.stringify(subjectNames, null, 2);
    fs.writeFileSync('subjectData.json', jsonData);
    console.log('Subjects data backed up successfully');
  } catch (error) {
    console.error('Error backing up subjects data:', error);
    throw error;
  }
}
// Route to backup items data
app.get('/backup_items_data', async (req, res) => {
  try {
    await backupItems();

    res.send("<script>alert('Items data successfully backed up'); window.location.href = '/';</script>");
  } catch (error) {
    console.error('Error occurred during backup:', error);
    res.status(500).send('An error occurred during backup.');
  }
});

// Function to backup items data
async function backupItems() {
  try {
    const items = await Item.find({});
    const jsonData = JSON.stringify(items, null, 2);
    fs.writeFileSync('itemsData.json', jsonData);
    console.log('Items data backed up successfully');
  } catch (error) {
    console.error('Error backing up items data:', error);
    throw error;
  }
}










// Route handler to check if student is registered
app.post('/check_faculty_registration', (req, res) => {
  // Extract the student ID number from the request body
  const studentId = req.body.student_id;
  console.log(studentId);
  // Query the database for a student with the provided ID number
  Faculty.findOne({ student_id: studentId }, (err, student) => {
    console.log('here');
    if (err) {
      // Handle database error
      console.error('Error querying database:', err);
      res.status(500).json({ success: false, message: 'An error occurred while checking student registration.' });
    } else {
      if (student) {
        // Student found in the database, indicate that the student is registered
        res.json({ success: true,registered: true,student: student, message: 'Faculty is registered.' });
        console.log("success: true,registered:true, message: 'Faculty is registered.'");
        console.log("Student found: ",student);
      } else {
        // No student found with the provided ID number, indicate that the student is not registered
        res.json({ success: true,registered: false, message: 'Faculty is not registered.' });
        console.log("{ success: true,registered: false,  message: 'Faculty is not registered.' }");
      }
    }
  });
});


app.post('/register_faculty',function(req,res){
  const student_id = req.body.student_id;
  const name = req.body.name;
  // const enrol_id = req.body.enrol_id;
  const contact_num = req.body.contact_number;
  const num_books = 0;
  // console.log(student_id + name + enrol_id + num_books);
  const student = new Faculty({
    student_id: student_id,
    name: name,
    // enrol_id: enrol_id,
    contact_number: contact_num,
    numBooksBorrowed: String(num_books)
  });

  student.save(function(err) {
      if (!err) {
          console.log("successfully inserted");
          // book_index = book_index + 1;
          // Send a pop-up alert for successful insertion
          res.send("<script>alert('Insert Successful'); window.location.href = '/';</script>");
      } else {
          console.log(err);
          console.log("Insert operation failed");
          // Handle error accordingly
          res.status(500).send("Insert operation failed");
      }
  });
});

app.get('/insert_faculty',function(req,res){
  res.render("insert_faculty",{});
});

app.get('/view_faculty',function(req,res){
  Faculty.find({}, function (err, foundItems) {

          res.render("view_faculty", { newListItems: foundItems });

  });
});

app.post('/view_issued_faculty', function(req, res) {
  const studentId = req.body.studentId;
  const parentHref = req.body.parentHref;
  console.log(studentId + parentHref);
Faculty.findById(studentId, function(err, student) {
  if (err) {
      console.log("Error finding student:", err);
      return res.status(500).send("Error finding student");
  }

  if (!student) {
      console.log("Student not found");
      return res.status(404).send("Student not found");
  }

  const books = [];
  let counter = 0;

  // Retrieve book details for each bookId in student's bookIds array
  student.bookIds.forEach(function(bookId) {
      Item.findById(bookId, function(err, book) {
          if (err) {
              console.log("Error finding book:", err);
              return res.status(500).send("Error finding book");
          }

          if (!book) {
              console.log("Book not found");
              // You might want to handle the case where a book is not found
              // For now, just log it and continue
              counter++;
              if (counter === student.bookIds.length) {
                  // If all books have been processed, render the template
                  res.render("view_issued_faculty", { newListItems: books, student: student, parentHref: parentHref });
              }
              return;
          }

          // If the book is found, add it to the books array
          books.push(book);

          // Check if all books have been processed
          counter++;
          if (counter === student.bookIds.length) {
              // If all books have been processed, render the template
              res.render("view_issued_faculty", { newListItems: books, student: student});
          }
      });
  });
});
});


app.post('/issue_book_faculty', async function(req, res) {
  const sid = req.body.sid;
  const bid = req.body.bid;
  console.log("sid = " + sid + " bid = " + bid);

  try {
    const student = await Faculty.findById(sid);
    if (!student) {
      console.log("Faculty not found");
      return res.status(404).send("Faculty not found");
    }

    student.bookIds.push(bid);
    // if(parseInt(student.numBooksBorrowed) == 6)
    // {
    //   return res.status(404).send()
    // }
    student.numBooksBorrowed = String(parseInt(student.numBooksBorrowed) + 1);

    studentId = student.student_id;
    studentName = student.name;
    // studentEnrolmentId = student.enrol_id;
    await student.save();
    console.log("Student: ", student);

    const book = await Item.findById(bid);
    if (!book) {
      console.log("Book not found");
      return res.status(404).send("Book not found");
    }

    book.status = '1';
    const date = new Date();
    book.date = String(date);
    const clean_date = String(date.getDate()) +'/' +String(date.getMonth() + 1)+'/'+ String(date.getFullYear());
    book.history_card = book.history_card + 'hi '+ '\t' +studentId +'\t' + studentName +'\t'+ clean_date+'\t'+'';
    await book.save();
    console.log("Book: ", book);

    res.render('issue_book_by_faculty', {});
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).send("Error processing request");
  }
});

app.post('/return_book_faculty', async function(req, res) {
  const sid = req.body.sid;
  const bid = req.body.bid;
  console.log("sid = " + sid + " bid = " + bid);

  try {
    const student = await Faculty.findById(sid);
    if (!student) {
      console.log("Student not found");
      return res.status(404).send("Student not found");
    }

    student.bookIds = student.bookIds.filter(bookId => bookId !== bid);
    student.numBooksBorrowed = String((student.bookIds.length));
    await student.save();
    console.log("Student: ", student);

    const book = await Item.findById(bid);
    if (!book) {
      console.log("Book not found");
      return res.status(404).send("Book not found");
    }

    book.status = '0';
    const date = new Date();
    const clean_date = String(date.getDate()) +'/' +String(date.getMonth() + 1)+'/'+ String(date.getFullYear());
    book.history_card = book.history_card + clean_date;
    await book.save();
    console.log("Book: ", book);

    res.render('return_book', {});
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).send("Error processing request");
  }
});

app.get('/faculty_issued',function(req, res){
  Faculty.find({ numBooksBorrowed: { $gt: 0 } }, (err, students) => {
  if (err) {
    console.error('Error finding students:', err);
    // Handle the error appropriately
  } else {
    console.log('Students with numBooksBorrowed > 0:', students);
    // Now you have an array of students with numBooksBorrowed > 0
    // You can further process or use this array as needed
    res.render('faculty_issued',{newListItems: students});
  }
});
});

app.get('/faculty_issued_report',function(req, res){
//   Student.find({ numBooksBorrowed: { $gt: 0 } }, (err, students) => {
//   if (err) {
//     console.error('Error finding students:', err);
//     // Handle the error appropriately
//   } else {
//     const currentDate = new Date();
//     console.log('Students with numBooksBorrowed > 0:', students);
//
//     // Now you have an array of students with numBooksBorrowed > 0
//     // You can further process or use this array as needed
//     res.render('student_issued_report',{currentDate: currentDate, newListItems: students});
//   }
// });
//
// Student.find({ numBooksBorrowed: { $gt: 0 } }, (err, students) => {
//   if (err) {
//     console.error('Error finding students:', err);
//     // Handle the error appropriately
//   } else {
//     const currentDate = new Date();
//     console.log('Students with numBooksBorrowed > 0:', students);
//
//     // Initialize an array to hold book details for each student
//     const bookDetailsByStudent = [];
//
//     students.forEach(student => {
//       // For each student, initialize an array to hold their borrowed books
//       const studentBookDetails = [];
//
//       // Iterate through each book ID the student has borrowed
//       student.bookIds.forEach(async bookId => {
//         try {
//           // Fetch the book details from the database using the book ID
//           const book = await Item.findById(bookId);
//           if (book) {
//             console.log(book);
//             studentBookDetails.push(book);
//             console.warn(`Book found with ID ${bookId}`);
//           } else {
//             console.warn(`Book not found with ID ${bookId}`);
//           }
//         } catch (error) {
//           console.error(`Error fetching book details with ID ${bookId}:`, error);
//           // Handle the error appropriately
//         }
//       });
//
//       // Push the array of book details for this student to the main array
//       bookDetailsByStudent.push(studentBookDetails);
//     });
//
//     // Now you have an array of objects, each containing a student's name and an array of their borrowed books
//     console.log('Book details by student:', bookDetailsByStudent);
//
//     // Render the report with the current date and the list of students with their borrowed books
//     res.render('student_issued_report', { currentDate: currentDate, newListItems: students, books: bookDetailsByStudent});
//   }
// });
Faculty.find({ numBooksBorrowed: { $gt: 0 } }, async (err, students) => {
  if (err) {
    console.error('Error finding students:', err);
    // Handle the error appropriately
    return;
  }

  try {
    const currentDate = new Date();
    console.log('Students with numBooksBorrowed > 0:', students);

    // Initialize an array to hold promises for fetching book details for each student
    const promises = students.map(async student => {
      // Fetch the book details for each student in parallel
      const studentBookDetails = await Promise.all(student.bookIds.map(async bookId => {
        try {
          // Fetch the book details from the database using the book ID
          const book = await Item.findById(bookId);
          if (book) {
            console.log(book);
            return book;
          } else {
            console.warn(`Book not found with ID ${bookId}`);
            return null; // or throw an error if needed
          }
        } catch (error) {
          console.error(`Error fetching book details with ID ${bookId}:`, error);
          // Handle the error appropriately
          return null;
        }
      }));

      // Filter out null values (books not found)
      return studentBookDetails.filter(book => book !== null);
    });

    // Wait for all promises to resolve
    const bookDetailsByStudent = await Promise.all(promises);

    // Now you have an array of arrays, each containing a student's borrowed books
    console.log('Book details by student:', bookDetailsByStudent);

    // Render the report with the current date and the list of students with their borrowed books
    res.render('faculty_issued_report', { currentDate: currentDate, newListItems: students, books: bookDetailsByStudent });
  } catch (error) {
    console.error('Error:', error);
    // Handle the error appropriately
  }
});
});







app.listen(3000, function (req, res) {
    console.log("server running 3000");
});
