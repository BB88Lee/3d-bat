class BBoxTable {
    constructor(options) {
        this.__bboxes = [];
        this.__tail = -1;
        this.__target = 0;
        this.tableId = options.tableId;
        this.$table = $("#" + options.tableId);
        if (options.liOptions == undefined) {
            this.liOptions = function (index) {
                return "";
            }
        } else {
            this.liOptions = options.liOptions;
        }
    }

    expand(label, hasImageLabel, hasPCDLabel) {
        var index = this.__tail + 1;
        this.__tail++;
        if (!$("#" + this.tableId + "-number-" + index)[0]) {
            var targetIndex = annotationObjects.getTargetIndex();
            var firstLetterOfClass = annotationObjects.contents[targetIndex]["class"].charAt(0);
            var trackId = annotationObjects.contents[targetIndex]["trackId"];
            var $li = $('<li class="jpeg-label-sidebar-item" ' + this.liOptions(index) + '>'
                + '<div class="label-tool-sidebar-number-box">'
                + '<p class="label-tool-sidebar-text number" id="' + this.tableId + '-number-' + index + '">' + firstLetterOfClass + trackId + '</p>'
                + '</div>'
                + '</li>'
            );
            $li.append($('<p class="label-tool-sidebar-text bbox" id="' + this.tableId + '-Image-' + index + '">Image</p>'));
            $li.append($('<p class="label-tool-sidebar-text bbox" id="' + this.tableId + '-PCD-' + index + '">PCD</p>'));
            $("#" + this.tableId).append($li);
        }
        this.__bboxes[index] = {label: label};
        if (hasImageLabel) {
            this.add(index, "Image");
        }
        if (hasPCDLabel) {
            this.add(index, "PCD");
        }
    }

    refresh() {
        var bboxBkup = this.__bboxes.slice(0, this.__bboxes.length);
        this.clear();
        for (var i in bboxBkup) {
            var hasImageLabel = bboxBkup[i]["Image"] != undefined;
            var hasPCDLabel = bboxBkup[i]["PCD"] != undefined;
            if (hasImageLabel || hasPCDLabel) {
                this.expand(bboxBkup[i]["label"], hasImageLabel, hasPCDLabel);
            }
        }
    }

    add(index, dataType) {
        var color = classesBoundingBox[this.__bboxes[index]["label"]]["color"];
        if (this.__bboxes[index] != undefined) {
            color = classesBoundingBox[this.__bboxes[index]["label"]].color;
        }
        $("#" + this.tableId + "-" + dataType + "-" + index).css("color", color);
        this.__bboxes[index][dataType] = 0; // Dummy
    }

    changeClass(index, cls) {
        //var color = classesBoundingBox[cls]["color"];
        var color = classesBoundingBox[cls].color;
        if (this.__bboxes[index]["Image"] != undefined) {
            $("#" + this.tableId + "-" + "Image" + "-" + index).css("color", color);
        }
        if (this.__bboxes[index]["PCD"] != undefined) {
            $("#" + this.tableId + "-" + "PCD" + "-" + index).css("color", color);
        }
        this.__bboxes[index]["label"] = cls;
    }

    remove(index, dataType) {
        $("#" + this.tableId + "-" + dataType + "-" + index).css("color", "#888");
        if (this.__bboxes[index] != undefined) {
            delete this.__bboxes[index][dataType];
        }
    }

    select(index) {
        $("#" + this.tableId + "-number-" + this.__target).css("color", "#ddd");
        $("#" + this.tableId + "-number-" + index).css("color", "#4894f4");
        this.__target = index;
    }

    clear() {
        $("#" + this.tableId).empty();
        this.__tail = -1;
        this.__bboxes = []
    }
};
