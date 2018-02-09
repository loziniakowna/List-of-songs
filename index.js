	$(document).ready(function(){

		var form = $("#form"),
			fields = form.find("input:not(:submit)"),
			exportJSON = $("#exportJSON"),
			importJSON = $("#importJSON"),
			jsonExported = $("#json--exported"),
			jsonImported = $("#json--imported"),
			lengthCalculated = $("#lengthCalculated"),
			lengthTotal = $(".lengthTotal"),
			ul = $("ul"),
			songs = [];


		//calculatin total length of songs
		function calculateTotalLength() { 

			var totalLengthMin = 0,
				totalLengthSec = 0,
				totalLength = 0;

			$.each(songs, function(i, obj) {
				totalLengthSec = totalLengthSec + Number(obj.lengthSec);
				totalLengthMin = totalLengthMin + Number(obj.lengthMin);
			});

			if (totalLengthSec%60 < 10) {
				totalLength = totalLengthMin + Math.floor(totalLengthSec/60) + ":0" + totalLengthSec%60;
			} else {
				totalLength = totalLengthMin + Math.floor(totalLengthSec/60) + ":" + totalLengthSec%60;
			};

			if(totalLengthSec > 0 || totalLengthMin > 0) {
				lengthCalculated.text(totalLength);
			} else {
				lengthCalculated.text("-----");
			};
		};

		//addding song to list
		function addSong(songText) {
			var li = $("<li></li>", 
				{
					class: "list__item"
				}),
				removelink = $("<a></a>", 
				{
					href: "#",
					id: "removeLink",
					class: "list__remove-link",
					title: "Remove song from list"
				});

			li.text(songText);
			$("ul").append(li);
			removelink.appendTo(li);

			calculateTotalLength();

			if(!(lengthTotal.is(":visible"))) {
				lengthTotal.fadeIn(400);
			};
		};

		form.on('submit', function(event) {
			event.preventDefault();
			
			//creating single song
			var song = {};

			fields.each(function(index, input) {
				if (input.value) {
					song[input.name] = input.value;
				} else if (input.name === "lengthSec") {
					song.lengthSec = "0";
				} else if (input.name === "lengthMin") {
				 	song.lengthMin = "00";
				} else {
				 	song[input.name] = "-----";
				};

				if (song.lengthSec < 10 && song.lengthSec.length < 2) {
					song.lengthSec = "0" + song.lengthSec;
				};

				$(this).val("");
			});

			 var songText = "TITLE: " + song.title +", ARTIST: " + song.artist + ", LENGTH: " + song.lengthMin + ":" + song.lengthSec + " ";

			//creating array of songs objects
			songs.push(song);
			addSong(songText);
			
			return songs;
		});

		//remove song from list
		ul.delegate('a', 'click', function(e) {
			e.preventDefault();

			var index = $(this).parent().index();

			songs.splice(index, 1);

			$("li").eq(index).remove();

			if(!($("li").length >0)) {
				lengthTotal.hide();
			};

			calculateTotalLength();
		});

		//import songs from JSON
		importJSON.on('click', function() {
			var jsonToSong = jsonImported.val(),
				songFromJson = $.parseJSON(jsonToSong);

			$.each(songFromJson, function(index, obj){
				songs.push(obj);
				return songs;
			});

			$.each(songFromJson, function(i, obj){
				var songText  = "TITLE: " + obj.title +", ARTIST: " + obj.artist + ", LENGTH: " + obj.lengthMin + ":" + obj.lengthSec + "";
				addSong(songText, songs);
			});

			jsonImported.val("");
		});

		//export songs list to JSON
		exportJSON.on("click", function(){

			var songToJSON = JSON.stringify(songs, null, 4);

			jsonExported.text(songToJSON).fadeIn(400);
		});

	});
