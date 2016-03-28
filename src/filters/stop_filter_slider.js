var update_network = require('../network/update_network');
var disable_sidebar = require('../sidebar/disable_sidebar');
var enable_sidebar  = require('../sidebar/enable_sidebar');
var make_filter_title = require('./make_filter_title');

module.exports = function stop_filter_slider(config, params, filter_type, available_views){

  // get value
  var inst_index = $( params.root+' .slider_'+filter_type ).slider( "value" );

  var inst_view_name = available_views[inst_index][filter_type];

  var requested_view = {};
  requested_view[filter_type] = inst_view_name;

  _.each(params.viz.possible_filters, function(reset_filter){
    if (filter_type != reset_filter){

      var tmp_title = make_filter_title(reset_filter);
      $(params.root+' .slider_'+reset_filter).slider( "value", 0);

      d3.select('.title_'+reset_filter)
        .text(tmp_title.text + tmp_title.value + tmp_title.suffix);
    }
  });


  disable_sidebar(params);

  // get current row ordering from buttons 
  if (d3.select(params.root+' .toggle_row_order .active').empty() === false){
    params.viz.inst_order.col = d3.select(params.root+' .toggle_row_order')
      .select('.active').attr('name');
  } else {
    params.viz.inst_order.col = 'clust';

    d3.select(params.root+' .toggle_row_order')
      .selectAll('.btn')
      .each(function(d){
        if (d === 'clust'){
          d3.select(this)
            .classed('active',true);
        }
      });
  }

  if (d3.select(params.root+' .toggle_col_order .active').empty() === false){
    params.viz.inst_order.row = d3.select(params.root+' .toggle_col_order')
      .select('.active').attr('name');
  } else {
    params.viz.inst_order.row = 'clust';

    d3.select(params.root+' .toggle_col_order')
      .selectAll('.btn')
      .each(function(d){
        if (d === 'clust'){
          d3.select(this)
            .classed('active',true);
        }
      });
  }

  params = update_network(config, params, requested_view);

  var filter_title = make_filter_title(filter_type);

  d3.select(params.root+' .title_'+filter_type)
    .text(filter_title.text + inst_view_name + filter_title.suffix);

  setTimeout(enable_sidebar, 2500, params);

  return params;

};